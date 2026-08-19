const POSTS_KEY = "post_manager_posts";

// Get all posts
export const getPosts = () => {
  const savedPosts = localStorage.getItem(POSTS_KEY);

  if (!savedPosts) {
    return [];
  }

  try {
    return JSON.parse(savedPosts);
  } catch (error) {
    console.error("Error loading posts:", error);
    return [];
  }
};

// Save all posts
export const savePosts = (posts) => {
  localStorage.setItem(
    POSTS_KEY,
    JSON.stringify(posts)
  );
};

// Add a new post
export const addPost = (title, content, author) => {
  const posts = getPosts();

  const newPost = {
    id: Date.now(),
    title: title,
    content: content,
    author: author,
    createdAt: new Date().toLocaleString(),
  };

  const updatedPosts = [...posts, newPost];

  savePosts(updatedPosts);

  return updatedPosts;
};

// Update an existing post
export const updatePost = (id, title, content) => {
  const posts = getPosts();

  const updatedPosts = posts.map((post) =>
    post.id === id
      ? {
          ...post,
          title: title,
          content: content,
          updatedAt: new Date().toLocaleString(),
        }
      : post
  );

  savePosts(updatedPosts);

  return updatedPosts;
};

// Delete a post
export const deletePost = (id) => {
  const posts = getPosts();

  const updatedPosts = posts.filter(
    (post) => post.id !== id
  );

  savePosts(updatedPosts);

  return updatedPosts;
};