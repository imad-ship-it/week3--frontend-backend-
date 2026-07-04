# Tests for role-based access control: admin vs. standard user permissions.
#
# Scenarios covered:
#   1. Standard user requesting another user's task (GET/PATCH/DELETE) → 404
#   2. Admin user requesting another user's task (GET/PATCH/DELETE) → 200/204
#   3. Standard user's own task still works normally → 200
#   4. List endpoint: admin sees all tasks, standard sees only their own
import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from accounts.models import Profile
from tasks.models import Task

# ──────────────────────────────────────────────
# ADMIN FIXTURES
# ──────────────────────────────────────────────


@pytest.fixture
def admin_user(db):
    """
    A test user whose Profile.role is set to 'admin'.

    We use Profile.objects.get_or_create to be resilient whether or not the
    post_save signal is connected (accounts/apps.py does not import signals in
    its ready() method, so the auto-create signal may not fire in tests).
    """
    user = User.objects.create_user(
        username="superadmin",
        email="superadmin@test.com",
        password="adminpass789",
    )
    # Ensure the profile exists and has the admin role.
    profile, _ = Profile.objects.get_or_create(user=user)
    profile.role = "admin"
    profile.save()
    return user


@pytest.fixture
def admin_client(db, admin_user):
    """An APIClient authenticated as admin_user via a real JWT token."""
    client = APIClient()
    response = client.post(
        "/api/token/",
        {"username": "superadmin", "password": "adminpass789"},
        format="json",
    )
    token = response.data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return client


@pytest.fixture
def other_user_task(db, user_two):
    """A Task owned by user_two (ali) — used as the 'foreign' task in tests."""
    return Task.objects.create(
        user=user_two,
        title="Ali's private task",
        description="Belongs to user_two",
        status="pending",
        priority="low",
    )


# ──────────────────────────────────────────────
# 1. STANDARD USER → ANOTHER USER'S TASK → 404
# ──────────────────────────────────────────────


@pytest.mark.django_db
class TestStandardUserCannotAccessOthersTasks:
    """
    A standard-role user must receive 404 for every detail action
    on a task they do not own (the task is invisible to their queryset).
    """

    def test_standard_get_other_users_task_returns_404(
        self, auth_client, other_user_task
    ):
        """GET /api/tasks/<id>/ for another user's task → 404."""
        response = auth_client.get(f"/api/tasks/{other_user_task.id}/")
        assert response.status_code == 404

    def test_standard_patch_other_users_task_returns_404(
        self, auth_client, other_user_task
    ):
        """PATCH /api/tasks/<id>/ for another user's task → 404."""
        response = auth_client.patch(
            f"/api/tasks/{other_user_task.id}/",
            {"status": "completed"},
            format="json",
        )
        assert response.status_code == 404
        # Confirm the original task is untouched
        other_user_task.refresh_from_db()
        assert other_user_task.status == "pending"

    def test_standard_delete_other_users_task_returns_404(
        self, auth_client, other_user_task
    ):
        """DELETE /api/tasks/<id>/ for another user's task → 404."""
        response = auth_client.delete(f"/api/tasks/{other_user_task.id}/")
        assert response.status_code == 404
        # Confirm the task still exists in the database
        assert Task.objects.filter(id=other_user_task.id).exists()


# ──────────────────────────────────────────────
# 2. ADMIN USER → ANOTHER USER'S TASK → 200/204
# ──────────────────────────────────────────────


@pytest.mark.django_db
class TestAdminUserCanAccessAnyTask:
    """
    An admin-role user must be able to GET, PATCH, and DELETE any task,
    regardless of which user owns it.
    """

    def test_admin_get_other_users_task_returns_200(
        self, admin_client, other_user_task
    ):
        """Admin GET /api/tasks/<id>/ for another user's task → 200."""
        response = admin_client.get(f"/api/tasks/{other_user_task.id}/")
        assert response.status_code == 200
        assert response.data["title"] == "Ali's private task"

    def test_admin_patch_other_users_task_returns_200(
        self, admin_client, other_user_task
    ):
        """Admin PATCH /api/tasks/<id>/ for another user's task → 200."""
        response = admin_client.patch(
            f"/api/tasks/{other_user_task.id}/",
            {"status": "in_progress"},
            format="json",
        )
        assert response.status_code == 200
        assert response.data["status"] == "in_progress"
        # Confirm the change was persisted
        other_user_task.refresh_from_db()
        assert other_user_task.status == "in_progress"

    def test_admin_delete_other_users_task_returns_204(
        self, admin_client, other_user_task
    ):
        """Admin DELETE /api/tasks/<id>/ for another user's task → 204."""
        task_id = other_user_task.id
        response = admin_client.delete(f"/api/tasks/{task_id}/")
        assert response.status_code == 204
        # Confirm the task was actually removed
        assert not Task.objects.filter(id=task_id).exists()


# ──────────────────────────────────────────────
# 3. STANDARD USER → OWN TASK → 200
# ──────────────────────────────────────────────


@pytest.mark.django_db
class TestStandardUserCanAccessOwnTasks:
    """
    Sanity checks: a standard-role user retains full access to their
    own tasks even after the permission layer is in place.
    """

    def test_standard_get_own_task_returns_200(self, auth_client, sample_task):
        """Standard user GET /api/tasks/<id>/ for their own task → 200."""
        response = auth_client.get(f"/api/tasks/{sample_task.id}/")
        assert response.status_code == 200
        assert response.data["title"] == sample_task.title

    def test_standard_patch_own_task_returns_200(self, auth_client, sample_task):
        """Standard user PATCH /api/tasks/<id>/ for their own task → 200."""
        response = auth_client.patch(
            f"/api/tasks/{sample_task.id}/",
            {"priority": "high"},
            format="json",
        )
        assert response.status_code == 200
        assert response.data["priority"] == "high"

    def test_standard_delete_own_task_returns_204(self, auth_client, sample_task):
        """Standard user DELETE /api/tasks/<id>/ for their own task → 204."""
        task_id = sample_task.id
        response = auth_client.delete(f"/api/tasks/{task_id}/")
        assert response.status_code == 204
        assert not Task.objects.filter(id=task_id).exists()


# ──────────────────────────────────────────────
# 4. LIST ENDPOINT SCOPING
# ──────────────────────────────────────────────


@pytest.mark.django_db
class TestListEndpointScoping:
    """
    GET /api/tasks/ must return:
      - All tasks across all users for an admin.
      - Only the requesting user's own tasks for a standard user.
    """

    def test_admin_list_returns_all_users_tasks(
        self, admin_client, user_one, user_two, db
    ):
        """Admin's task list contains tasks belonging to multiple users."""
        task_a = Task.objects.create(
            user=user_one,
            title="Imad's task for list test",
            status="pending",
            priority="medium",
        )
        task_b = Task.objects.create(
            user=user_two,
            title="Ali's task for list test",
            status="pending",
            priority="high",
        )

        response = admin_client.get("/api/tasks/")
        assert response.status_code == 200

        returned_ids = {t["id"] for t in response.data}
        assert task_a.id in returned_ids
        assert task_b.id in returned_ids

    def test_standard_list_returns_only_own_tasks(
        self, auth_client, user_one, user_two, db
    ):
        """Standard user's task list excludes tasks owned by other users."""
        own_task = Task.objects.create(
            user=user_one,
            title="Imad's exclusive task",
            status="pending",
            priority="low",
        )
        other_task = Task.objects.create(
            user=user_two,
            title="Ali's exclusive task",
            status="pending",
            priority="low",
        )

        response = auth_client.get("/api/tasks/")
        assert response.status_code == 200

        returned_ids = {t["id"] for t in response.data}
        assert own_task.id in returned_ids
        assert other_task.id not in returned_ids

    def test_admin_list_is_superset_of_standard_list(
        self, admin_client, auth_client, user_one, user_two, db
    ):
        """The admin list is a strict superset of any individual user's list."""
        Task.objects.create(
            user=user_one,
            title="User-one superset task",
            status="pending",
            priority="medium",
        )
        Task.objects.create(
            user=user_two,
            title="User-two superset task",
            status="completed",
            priority="high",
        )

        admin_response = admin_client.get("/api/tasks/")
        standard_response = auth_client.get("/api/tasks/")

        admin_ids = {t["id"] for t in admin_response.data}
        standard_ids = {t["id"] for t in standard_response.data}

        # Every task the standard user sees, the admin also sees
        assert standard_ids.issubset(admin_ids)
        # The admin sees strictly more tasks (at least user_two's)
        assert len(admin_ids) > len(standard_ids)
