import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { decodeJWT } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const roleData = {
  student: {
    title: "Student Portal",
    icon: "🎓",
    description: "Access your academic information and student services.",
  },

  parent: {
    title: "Parent Portal",
    icon: "👨‍👩‍👦",
    description: "Monitor your child's academic progress and activities.",
  },

  teacher: {
    title: "Staff Portal",
    icon: "👨‍🏫",
    description: "Manage students, classes and academic activities.",
  },

  management: {
    title: "Management Portal",
    icon: "👔",
    description: "Access institutional analytics and administrative controls.",
  },
};

function Dashboard() {

  const { token, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const user = decodeJWT(token);

  const data = roleData[user.role];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goToPortal = (role) => {
    navigate(`/portal/${role}`);
  };

  return (
    <div className="dashboard-page">

      <header className="navbar">

        <div className="navbar-brand">

          <div className="small-logo">
            🎓
          </div>

          <div>
            <strong>EduSecure</strong>
            <span>University Portal</span>
          </div>

        </div>

        <div className="navbar-right">

          <div className="user-info">

            <div className="avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user.username}</strong>
              <span>{user.role}</span>
            </div>

          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      <main className="dashboard-container">

        <div className="welcome-card">

          <div>

            <div className="portal-label">
              {data.icon} {data.title}
            </div>

            <h1>
              Welcome, {user.username}
            </h1>

            <p>
              {data.description}
            </p>

          </div>

          <div className="access-level">

            <span>ACCESS LEVEL</span>

            <strong>
              Level {user.accessLevel}
            </strong>

          </div>

        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <span className="stat-icon">🔐</span>
            <div>
              <strong>Authenticated</strong>
              <p>JWT Verified</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🛡️</span>
            <div>
              <strong>Role Protected</strong>
              <p>RBAC Enabled</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">⚡</span>
            <div>
              <strong>Session</strong>
              <p>Active</p>
            </div>
          </div>

        </div>

        <section className="portal-section">

          <div className="section-heading">

            <div>
              <h2>Available Portals</h2>
              <p>
                Access is controlled according to your role.
              </p>
            </div>

          </div>

          <div className="portal-grid">

            {user.accessLevel >= 1 && (
              <PortalCard
                icon="🎓"
                title="Student Portal"
                description="Academic records, attendance and courses."
                role="student"
                activeRole={user.role}
                onClick={goToPortal}
              />
            )}

            {user.accessLevel >= 2 && (
              <PortalCard
                icon="👨‍👩‍👦"
                title="Parent Portal"
                description="Student progress, attendance and communication."
                role="parent"
                activeRole={user.role}
                onClick={goToPortal}
              />
            )}

            {user.accessLevel >= 3 && (
              <PortalCard
                icon="👨‍🏫"
                title="Staff Portal"
                description="Classes, students and academic management."
                role="teacher"
                activeRole={user.role}
                onClick={goToPortal}
              />
            )}

            {user.accessLevel >= 4 && (
              <PortalCard
                icon="👔"
                title="Management Portal"
                description="Institutional analytics and administration."
                role="management"
                activeRole={user.role}
                onClick={goToPortal}
              />
            )}

          </div>

        </section>

        <div className="security-info">

          <span>🔒</span>

          <div>
            <strong>Secure Session</strong>

            <p>
              Your session is authenticated using a
              signed JSON Web Token.
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}

function PortalCard({
  icon,
  title,
  description,
  role,
  activeRole,
  onClick,
}) {

  return (
    <div className="portal-card">

      <div className="portal-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      {role === activeRole ? (
        <button
          className="portal-button"
          onClick={() => onClick(role)}
        >
          Open Portal →
        </button>
      ) : (
        <div className="available-label">
          Accessible
        </div>
      )}

    </div>
  );
}

export default Dashboard;