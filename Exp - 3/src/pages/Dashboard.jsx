import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import PostCard from "../components/PostCard.jsx";
import PostForm from "../components/PostForm.jsx";

import { getToken } from "../utils/storage.js";
import { decodeToken } from "../utils/jwt.js";

import {
  getPosts,
  addPost,
  updatePost,
  deletePost,
} from "../utils/postsStorage.js";

function Dashboard() {
  const navigate = useNavigate();

  // Get logged-in user
  const token = getToken();
  const user = decodeToken(token);

  // Store posts
  const [posts, setPosts] = useState([]);

  // Store post currently being edited
  const [editingPost, setEditingPost] = useState(null);

  // Load posts from localStorage
  useEffect(() => {
    const savedPosts = getPosts();
    setPosts(savedPosts);
  }, []);

  // Create post
  const handleCreate = (title, content) => {
    const updatedPosts = addPost(
      title,
      content,
      user?.username
    );

    setPosts(updatedPosts);
  };

  // Edit post
  const handleEdit = (id, title, content) => {
    const updatedPosts = updatePost(
      id,
      title,
      content
    );

    setPosts(updatedPosts);

    setEditingPost(null);
  };

  // Delete post
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedPosts = deletePost(id);

    setPosts(updatedPosts);
  };

  // Viewer cannot edit
  const canEdit =
    user?.role === "editor" ||
    user?.role === "admin";

  // Only admin can delete
  const canDelete =
    user?.role === "admin";

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("post_manager_token");

    navigate("/login");
  };

  return (
    <div>

      <Navbar
        username={user?.username}
        role={user?.role}
        onLogout={handleLogout}
      />

      <div className="dashboard">

        <h1>Post Dashboard</h1>

        <p>
          Logged in as:{" "}
          <strong>{user?.username}</strong>
        </p>

        <p>
          Role:{" "}
          <strong>{user?.role}</strong>
        </p>

        {/* Role Information */}

        <div className="role-info">

          {user?.role === "viewer" && (
            <p>
              👁️ Viewer can create posts.
            </p>
          )}

          {user?.role === "editor" && (
            <p>
              ✏️ Editor can create and edit posts.
            </p>
          )}

          {user?.role === "admin" && (
            <p>
              👑 Admin can create, edit and delete posts.
            </p>
          )}

        </div>

        {/* Create/Edit Form */}

        <PostForm
          onCreate={handleCreate}
          editingPost={editingPost}
          onEdit={handleEdit}
          onCancelEdit={() => setEditingPost(null)}
          canEdit={canEdit}
        />

        {/* Posts */}

        <h2>
          All Posts ({posts.length})
        </h2>

        {posts.length === 0 ? (
          <div className="post-card">
            <p>
              No posts available. Create your first post!
            </p>
          </div>
        ) : (
          <div className="posts-container">

            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                canEdit={canEdit}
                canDelete={canDelete}
                onEdit={() => setEditingPost(post)}
                onDelete={() =>
                  handleDelete(post.id)
                }
              />
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;