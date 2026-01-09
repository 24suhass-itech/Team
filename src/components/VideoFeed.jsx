import { useState } from "react";

export default function VideoFeed() {
  const [hasVideo, setHasVideo] = useState(false);

  return (
    <div className="card video-card">
      <div className="section-title">Live Video</div>
      <div className={`video-body ${hasVideo ? "video-on" : "video-off"}`}>
        <video
          src="http://DRONE_IP:PORT/stream"
          autoPlay
          muted
          playsInline
          onLoadedData={() => setHasVideo(true)}
          onError={() => setHasVideo(false)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: hasVideo ? "block" : "none",
            borderRadius: "16px"
          }}
        />
        {!hasVideo && <span>Live Camera Feed</span>}
      </div>
    </div>
  );
}
