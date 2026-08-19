function PostCard({
  post,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}) {
  return (
    <div className="post-card">

      <h3>{post.title}</h3>

      <p>{post.content}</p>

      <div className="post-details">

        {post.author && (
          <p>
            <strong>Created by:</strong>{" "}
            {post.author}
          </p>
        )}

        {post.createdAt && (
          <p>
            <strong>Created:</strong>{" "}
            {post.createdAt}
          </p>
        )}

        {post.updatedAt && (
          <p>
            <strong>Last updated:</strong>{" "}
            {post.updatedAt}
          </p>
        )}

      </div>

      <div className="post-actions">

        {canEdit && (
          <button onClick={onEdit}>
            Edit
          </button>
        )}

        {canDelete && (
          <button
            className="delete-button"
            onClick={onDelete}
          >
            Delete
          </button>
        )}

      </div>

    </div>
  );
}

export default PostCard;