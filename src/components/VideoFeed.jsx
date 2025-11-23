export default function VideoFeed() {
  return (
    <div className="card">
      <div className="section-title">Live Video</div>
      <img
        id="video"
        src="http://<CAMERA_FEED_URL>"
        alt="Live Camera Feed"
      />
    </div>
  );
}
