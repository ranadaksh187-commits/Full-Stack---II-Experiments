import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { decodeJWT } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const roleData = {
  viewer: {
    title: "Viewer / Creator Portal",
    icon: "👁️",
    description:
      "Create posts and view published content.",
  },

  editor: {
    title: "Editor Portal",
    icon: "✏️",
    description:
      "Create and update posts and manage published content.",
  },

  admin: {
    title: "Admin Portal",
    icon: "👑",
    description:
      "Full control over post creation, editing and deletion.",
  },
};

function Dashboard() {
  const { token, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const user = decodeJWT(token);

  const data = roleData[user.role];

  const [posts, setPosts] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingPost, setEditingPost] = useState(null);

  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");


  /* Load posts */

  useEffect(() => {
    const savedPosts =
      JSON.parse(
        localStorage.getItem("posts")
      ) || [];

    setPosts(savedPosts);
  }, []);


  /* Save posts */

  const savePosts = (updatedPosts) => {
    localStorage.setItem(
      "posts",
      JSON.stringify(updatedPosts)
    );

    setPosts(updatedPosts);
  };


  /* Create or update post */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter title and content.");
      return;
    }


    /* Update */

    if (editingPost) {

      const updatedPosts = posts.map((post) =>
        post.id === editingPost.id
          ? {
              ...post,
              title,
              content,
              updatedBy: user.username,
              updatedAt: new Date().toLocaleString(),
            }
          : post
      );

      savePosts(updatedPosts);

      alert("Post updated successfully.");

    }


    /* Create */

    else {

      const newPost = {
        id: Date.now(),
        title,
        content,
        createdBy: user.username,
        createdAt: new Date().toLocaleString(),
      };

      savePosts([
        newPost,
        ...posts,
      ]);

      alert("Post created successfully.");
    }


    clearForm();
  };


  /* Edit post */

  const handleEdit = (post) => {

    setEditingPost(post);

    setTitle(post.title);

    setContent(post.content);

    setShowForm(true);

    window.scrollTo({
      top: 300,
      behavior: "smooth",
    });
  };


  /* Delete post */

  const handleDelete = (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this post?"
      );

    if (!confirmDelete) return;

    const updatedPosts =
      posts.filter(
        (post) => post.id !== id
      );

    savePosts(updatedPosts);

    alert("Post deleted successfully.");
  };


  /* Clear form */

  const clearForm = () => {

    setTitle("");

    setContent("");

    setEditingPost(null);

    setShowForm(false);
  };


  /* Logout */

  const handleLogout = () => {

    logout();

    navigate("/");
  };


  /* Permission system */

  const canCreate =
    user.role === "viewer" ||
    user.role === "editor" ||
    user.role === "admin";

  const canEdit =
    user.role === "editor" ||
    user.role === "admin";

  const canDelete =
    user.role === "admin";


  return (
    <div className="dashboard-page">

      {/* Navbar */}

      <header className="navbar">

        <div className="navbar-brand">

          <div className="small-logo">
            📝
          </div>

          <div>

            <strong>
              PostSecure
            </strong>

            <span>
              Post Management System
            </span>

          </div>

        </div>


        <div className="navbar-right">

          <div className="user-info">

            <div className="avatar">
              {user.username
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <strong>
                {user.username}
              </strong>

              <span>
                {user.role}
              </span>

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


      {/* Main */}

      <main className="dashboard-container">

        {/* Welcome */}

        <div className="welcome-card">

          <div>

            <div className="portal-label">

              {data.icon}{" "}

              {data.title}

            </div>

            <h1>
              Welcome, {user.username}
            </h1>

            <p>
              {data.description}
            </p>

          </div>


          <div className="access-level">

            <span>
              ACCESS LEVEL
            </span>

            <strong>
              Level {user.accessLevel}
            </strong>

          </div>

        </div>


        {/* Permission cards */}

        <div className="stats-grid">

          <div className="stat-card">

            <span className="stat-icon">
              ➕
            </span>

            <div>

              <strong>
                Create
              </strong>

              <p>
                {canCreate
                  ? "Allowed"
                  : "Restricted"}
              </p>

            </div>

          </div>


          <div className="stat-card">

            <span className="stat-icon">
              ✏️
            </span>

            <div>

              <strong>
                Update
              </strong>

              <p>
                {canEdit
                  ? "Allowed"
                  : "Restricted"}
              </p>

            </div>

          </div>


          <div className="stat-card">

            <span className="stat-icon">
              🗑️
            </span>

            <div>

              <strong>
                Delete
              </strong>

              <p>
                {canDelete
                  ? "Allowed"
                  : "Restricted"}
              </p>

            </div>

          </div>

        </div>


        {/* Post Manager */}

        <section className="portal-section">

          <div className="section-heading">

            <div>

              <h2>
                Post Manager
              </h2>

              <p>
                Create, view and manage posts
                according to your permissions.
              </p>

            </div>


            {canCreate && (

              <button
                className="create-post-button"
                onClick={() => {
                  clearForm();
                  setShowForm(true);
                }}
              >
                + Create Post
              </button>

            )}

          </div>


          {/* Post Form */}

          {showForm && (

            <div className="post-form-card">

              <div className="form-header">

                <div>

                  <h3>
                    {editingPost
                      ? "Edit Post"
                      : "Create New Post"}
                  </h3>

                  <p>
                    {editingPost
                      ? "Update the selected post."
                      : "Add a new post to the system."}
                  </p>

                </div>

                <button
                  className="close-button"
                  onClick={clearForm}
                >
                  ×
                </button>

              </div>


              <form
                onSubmit={handleSubmit}
                className="post-form"
              >

                <label>
                  Post Title
                </label>

                <input
                  type="text"
                  placeholder="Enter post title"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                />


                <label>
                  Post Content
                </label>

                <textarea
                  placeholder="Write your post content..."
                  rows="5"
                  value={content}
                  onChange={(e) =>
                    setContent(e.target.value)
                  }
                />


                <div className="form-actions">

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={clearForm}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-post-button"
                  >
                    {editingPost
                      ? "Update Post"
                      : "Publish Post"}
                  </button>

                </div>

              </form>

            </div>

          )}


          {/* Posts */}

          <div className="posts-container">

            {posts.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  📝
                </div>

                <h3>
                  No posts yet
                </h3>

                <p>
                  Create your first post to
                  get started.
                </p>

              </div>

            ) : (

              posts.map((post) => (

                <article
                  className="post-card"
                  key={post.id}
                >

                  <div className="post-top">

                    <div>

                      <span className="post-badge">
                        POST
                      </span>

                      <h3>
                        {post.title}
                      </h3>

                    </div>

                  </div>


                  <p className="post-content">
                    {post.content}
                  </p>


                  <div className="post-footer">

                    <div className="post-meta">

                      <span>
                        👤 {post.createdBy}
                      </span>

                      <span>
                        🕒 {post.createdAt}
                      </span>

                    </div>


                    {/* Edit */}

                    {canEdit && (

                      <button
                        className="edit-button"
                        onClick={() =>
                          handleEdit(post)
                        }
                      >
                        ✏️ Edit
                      </button>

                    )}


                    {/* Delete */}

                    {canDelete && (

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(post.id)
                        }
                      >
                        🗑️ Delete
                      </button>

                    )}

                  </div>

                </article>

              ))

            )}

          </div>

        </section>


        {/* Security */}

        <div className="security-info">

          <span>
            🔒
          </span>

          <div>

            <strong>
              Role-Based Access Control
            </strong>

            <p>
              Your available post operations
              are controlled according to your
              authenticated role.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;