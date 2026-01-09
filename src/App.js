import { useState, useEffect } from "react";
import socket from "./socket";
import "./styles.css";
import VideoFeed from "./components/VideoFeed";
import TelemetryPanel from "./components/TelemetryPanel";
import MapPanel from "./components/MapPanel";

export default function App() {
  const [active, setActive] = useState(null);
  const [telemetry, setTelemetry] = useState({});

  useEffect(() => {
    socket.on("telemetry", data => setTelemetry(data));
  }, []);

  return (
    <>
      <div className={`app ${active ? "blurred" : ""}`}>
        <div className="header">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy0H6tV3j6tasJU7mQ-KuimJeqHfovWoDs0A&s"
            className="header-logo"
          />
          <div className="header-title">VAYUPUTRA</div>
          <img
            src="https://psgitech.ac.in/social/logo.png"
            className="header-logo"
          />
        </div>

        <div className="grid">
          <div className="click-wrapper" onClick={() => setActive("video")}>
            <VideoFeed />
          </div>

          <div className="click-wrapper" onClick={() => setActive("telemetry")}>
            <TelemetryPanel data={telemetry} />
          </div>

          <MapPanel />
        </div>
      </div>

      {active && (
        <div className="overlay" onClick={() => setActive(null)}>
          <div className="expanded" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setActive(null)}>×</button>
            {active === "video" && <VideoFeed />}
            {active === "telemetry" && <TelemetryPanel data={telemetry} />}
          </div>
        </div>
      )}
    </>
  );
}
