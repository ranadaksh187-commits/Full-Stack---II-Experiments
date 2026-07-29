import { useSelector, useDispatch } from "react-redux";
import { deletePost } from "../features/posts/postSlice";

function PostList() {
  const posts = useSelector((state) => state.posts.posts);
  const dispatch = useDispatch();

  return (
    <div className="card">
      <h2>📋 All Posts</h2>

      {posts.length === 0 ? (
        <div className="empty-posts">
          <h3>No Posts Yet!</h3>
          <p>Create your first post using the form.</p>
        </div>
      ) : (
        posts.map((post) => (
          <div className="post-card" key={post.id}>
            <div className="post-content">
              <h3>{post.title}</h3>

              <div className="badge">
                📱 {post.platform}
              </div>
            </div>

            <button
              className="delete-btn"
              onClick={() => dispatch(deletePost(post.id))}
            >
              🗑 Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default PostList;