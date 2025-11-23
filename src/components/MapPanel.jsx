/* global L */
import { useEffect } from "react";
import socket from "../socket";

export default function MapPanel() {
  useEffect(() => {
    const map = L.map("map").setView([12.9716, 77.5946], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    const icon = L.icon({
      iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    const marker = L.marker([12.9716, 77.5946], { icon }).addTo(map);

    const waypoints = [
      [12.9716, 77.5946],
      [12.9722, 77.5951],
      [12.9711, 77.596],
    ];

    L.polyline(waypoints, { color: "#2563eb" }).addTo(map);

    socket.on("telemetry", (t) => {
      if (typeof t.lat === "number" && typeof t.lon === "number") {
        marker.setLatLng([t.lat, t.lon]);
      }
    });
  }, []);

  return (
    <div className="card" style={{ gridColumn: "1 / -1" }}>
      <div className="section-title">Map & Waypoints</div>
      <div id="map"></div>
    </div>
  );
}
