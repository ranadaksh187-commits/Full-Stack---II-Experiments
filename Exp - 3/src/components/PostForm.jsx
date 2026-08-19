import { useEffect, useState } from "react";

function PostForm({
  onCreate,
  editingPost,
  onEdit,
  onCancelEdit,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Load selected post into form
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [editingPost]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter both title and content.");
      return;
    }

    // Edit existing post
    if (editingPost) {
      onEdit(
        editingPost.id,
        title,
        content
      );
    }

    // Create new post
    else {
      onCreate(
        title,
        content
      );
    }

    setTitle("");
    setContent("");
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");

    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <div className="post-form">

      <h2>
        {editingPost
          ? "Edit Post"
          : "Create New Post"}
      </h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Enter post title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          placeholder="Write your post content..."
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
        />

        <div className="post-actions">

          <button type="submit">
            {editingPost
              ? "Update Post"
              : "Create Post"}
          </button>

          {editingPost && (
            <button
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}

        </div>

      </form>

    </div>
  );
}

export default PostForm;