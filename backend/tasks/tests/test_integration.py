# tasks/test_integration.py

import pytest
from rest_framework import status
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_full_happy_path_register_login_crud():
    """
    Sequential integration test simulating a real client:
    register -> login -> create task -> retrieve -> update -> delete.
    No fixtures. Every piece of state comes from the API itself.
    """
    client = APIClient()

    # --- Step 1: Register ---
    register_payload = {
        "username": "integrationuser",
        "password": "StrongPass123!",
        "password2": "StrongPass123!",
        "email": "integration@example.com",
    }
    response = client.post("/api/register/", register_payload, format="json")
    assert response.status_code == status.HTTP_201_CREATED, response.data

    # --- Step 2: Login (obtain JWT) ---
    login_payload = {
        "username": "integrationuser",
        "password": "StrongPass123!",
    }
    response = client.post("/api/token/", login_payload, format="json")
    assert response.status_code == status.HTTP_200_OK, response.data
    access_token = response.data["access"]
    assert access_token

    # Attach token for every subsequent request
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

    # --- Step 3: Create task ---
    create_payload = {
        "title": "Integration test task",
        "description": "Created during sequential integration test",
        "status": "pending",
        "priority": "high",
    }
    response = client.post("/api/tasks/", create_payload, format="json")
    assert response.status_code == status.HTTP_201_CREATED, response.data
    task_id = response.data["id"]
    assert response.data["title"] == "Integration test task"
    # user should be auto-assigned, not client-supplied
    assert "user" in response.data

    # --- Step 4: Retrieve task ---
    response = client.get(f"/api/tasks/{task_id}/")
    assert response.status_code == status.HTTP_200_OK, response.data
    assert response.data["id"] == task_id

    # --- Step 5: Update task ---
    update_payload = {"status": "in_progress"}
    response = client.patch(f"/api/tasks/{task_id}/", update_payload, format="json")
    assert response.status_code == status.HTTP_200_OK, response.data
    assert response.data["status"] == "in_progress"

    # --- Step 6: Delete task ---
    response = client.delete(f"/api/tasks/{task_id}/")
    assert response.status_code == status.HTTP_204_NO_CONTENT

    # --- Step 7: Confirm deletion ---
    response = client.get(f"/api/tasks/{task_id}/")
    assert response.status_code == status.HTTP_404_NOT_FOUND
