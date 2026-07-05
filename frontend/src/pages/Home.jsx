// src/pages/Home.jsx
export default function Home() {
  return (
    <div className="container">
      <div
        className="home"
        style={{ textAlign: 'center', padding: '4rem 2rem' }}
      >
        <h1
          style={{
            fontSize: '3.5rem',
            fontWeight: '900',
            marginBottom: '1.5rem',
            background: 'linear-gradient(to right, #2e5bff, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Master Your Day
        </h1>
        <p
          style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 2rem',
          }}
        >
          The modern, minimalist way to organize your tasks and boost your
          productivity. Stay focused on what matters.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
          marginTop: '4rem',
        }}
      >
        {['Focus', 'Organize', 'Achieve'].map((item) => (
          <div key={item} className="task-card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'var(--accent)' }}>{item}</h3>
            <p>
              Seamlessly manage your daily flow with our intuitive interface.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
