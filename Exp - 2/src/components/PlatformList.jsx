import { useSelector } from "react-redux";

function PlatformList() {
  const platforms = useSelector(
    (state) => state.platforms.platforms
  );

  return (
    <div className="card">

      <h2>🌍 Supported Platforms</h2>

      <div className="platform-grid">

        {platforms.map((platform, index) => (

          <div
            className="platform-card"
            key={index}
          >
            {platform}
          </div>

        ))}

      </div>

    </div>
  );
}

export default PlatformList;