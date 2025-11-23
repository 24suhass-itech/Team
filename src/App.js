import "./styles.css";
import VideoFeed from "./components/VideoFeed";
import TelemetryPanel from "./components/TelemetryPanel";
import MapPanel from "./components/MapPanel";

export default function App() {
  return (
    <div className="grid">
      <VideoFeed />
      <TelemetryPanel />
      <MapPanel />
    </div>
  );
}
