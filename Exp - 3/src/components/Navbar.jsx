function Navbar({
  username,
  role,
  onLogout,
}) {
  return (
    <nav className="navbar">

      <h2>Post Manager</h2>

      <div className="user-section">

        <span>
          {username} ({role})
        </span>

        <button onClick={onLogout}>
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;