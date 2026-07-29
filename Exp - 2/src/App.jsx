import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import PlatformList from "./components/PlatformList";

function App() {
  return (
    <div className="container">

      <header className="header">
        <h1>🚀 Redux Toolkit Post Manager</h1>

        <p>
          Manage posts using centralized state management with Redux Toolkit
        </p>
      </header>

      <div className="grid">

        <div className="left-panel">

          <PostForm />

          <PlatformList />

        </div>

        <div className="right-panel">

          <PostList />

        </div>

      </div>

    </div>
  );
}

export default App;