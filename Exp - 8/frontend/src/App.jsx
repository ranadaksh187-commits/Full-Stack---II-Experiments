import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/posts');
      if (!response.ok) {
        throw new Error(`Could not load posts (HTTP ${response.status}).`);
      }
      const data = await response.json();
      setPosts(data);
      setError('');
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError('Could not connect to the backend. Make sure it is running on port 8080.');
    }
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 3000); // Poll every 3 seconds to show updates
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/api/posts/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          scheduledTime: scheduleTime
        })
      });

      if (!response.ok) {
        throw new Error(`Could not schedule post (HTTP ${response.status}).`);
      }

      const savedPost = await response.json();
      setPosts((currentPosts) => [...currentPosts, savedPost]);
      setContent('');
      setScheduleTime('');
      setSuccess('Post scheduled successfully.');
    } catch (error) {
      console.error("Error scheduling post:", error);
      setError(error instanceof TypeError
        ? 'Could not connect to the backend. Make sure it is running on port 8080.'
        : error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (post) => {
    if (!window.confirm('Delete this scheduled post?')) return;

    setError('');
    setSuccess('');
    setDeletingPostId(post.id);

    try {
      const response = await fetch(`http://localhost:8080/api/posts/${post.id}`, {
        method: 'DELETE'
      });

      if (response.status === 409) {
        throw new Error('This post can no longer be deleted because it is being processed.');
      }
      if (!response.ok) {
        throw new Error(`Could not delete post (HTTP ${response.status}).`);
      }

      setPosts((currentPosts) => currentPosts.filter((currentPost) => currentPost.id !== post.id));
      setSuccess('Scheduled post deleted.');
    } catch (error) {
      console.error("Error deleting post:", error);
      setError(error instanceof TypeError
        ? 'Could not connect to the backend. Make sure it is running on port 8080.'
        : error.message);
    } finally {
      setDeletingPostId(null);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <p className="eyebrow">POST PLANNER</p>
        <h1>Post scheduler</h1>
        <p>Plan your posts and manage what’s coming up.</p>
      </header>

      <main className="main-content">
        <section className="form-section">
          <h2>Schedule a post</h2>
          <p className="section-description">Choose what to post and when it should be scheduled.</p>
          <form onSubmit={handleSubmit} className="post-form">
            {error && <p className="form-message error-message" role="alert">{error}</p>}
            {success && <p className="form-message success-message" role="status">{success}</p>}
            <div className="form-group">
              <label htmlFor="post-content">Post content</label>
              <textarea 
                id="post-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the post you want to schedule"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="schedule-time">Schedule date and time</label>
              <input 
                id="schedule-time"
                type="datetime-local" 
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                required
              />
              <span className="field-hint">The time is shown in your local timezone.</span>
            </div>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Scheduling…' : 'Schedule post'}
            </button>
          </form>
        </section>

        <section className="posts-section">
          <div className="section-heading">
            <div>
              <h2>Your posts</h2>
              <p className="section-description">Delete a post any time before it starts processing.</p>
            </div>
            <span className="post-count">{posts.length}</span>
          </div>
          <div className="posts-grid">
            {posts.length === 0 ? (
              <p className="no-posts">No posts scheduled yet. Your scheduled posts will appear here.</p>
            ) : (
              posts.map(post => (
                <div key={post.id} className={`post-card status-${post.status.toLowerCase()}`}>
                  <div className="post-header">
                    <span className="post-status">{post.status.toLowerCase()}</span>
                    {post.status === 'PENDING' && (
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDelete(post)}
                        disabled={deletingPostId === post.id}
                        aria-label={`Delete scheduled post ${post.id}`}
                      >
                        {deletingPostId === post.id ? 'Deleting…' : 'Delete'}
                      </button>
                    )}
                  </div>
                  <div className="post-content">{post.content}</div>
                  <div className="post-time">
                    {new Date(post.scheduledTime).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
