import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../features/posts/postSlice";

function PostForm() {

  const dispatch = useDispatch();

  const platforms = useSelector(
    (state) => state.platforms.platforms
  );

  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("Instagram");

  const handleSubmit = (e) => {

    e.preventDefault();

    if (title.trim() === "") {
      alert("Please enter a post title.");
      return;
    }

    dispatch(
      addPost({
        id: Date.now(),
        title,
        platform,
      })
    );

    setTitle("");
    setPlatform("Instagram");
  };

  return (

    <div className="card">

      <h2>📝 Create New Post</h2>

      <form onSubmit={handleSubmit}>

        <label>Post Title</label>

        <input
          type="text"
          placeholder="What's on your mind?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Select Platform</label>

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >

          {platforms.map((item, index) => (

            <option
              key={index}
              value={item}
            >
              {item}
            </option>

          ))}

        </select>

        <button type="submit">
          🚀 Publish Post
        </button>

      </form>

    </div>

  );
}

export default PostForm;