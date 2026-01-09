/* global L */
import { useEffect, useRef } from "react";
import socket from "../socket";

export default function MapPanel() {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Default position (same as backend)
  const defaultPos = [11.06, 77.10];

  useEffect(() => {
    // Init map ONCE
    mapRef.current = L.map("map").setView(defaultPos, 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(mapRef.current);

    const icon = L.icon({
      iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    markerRef.current = L.marker(defaultPos, { icon }).addTo(mapRef.current);

    // Static waypoints (optional)
    const waypoints = [
      [11.06, 77.10],
      [11.061, 77.101],
      [11.062, 77.102],
    ];
    L.polyline(waypoints, { color: "#2563eb" }).addTo(mapRef.current);

    // Telemetry listener
    const onTelemetry = (t) => {
      if (typeof t.lat === "number" && typeof t.lon === "number") {
        markerRef.current.setLatLng([t.lat, t.lon]);
        mapRef.current.panTo([t.lat, t.lon]); // 🔥 THIS FIXES IT
      }
    };

    socket.on("telemetry", onTelemetry);

    // Cleanup (VERY important)
    return () => {
      socket.off("telemetry", onTelemetry);
      mapRef.current.remove();
    };
  }, []);

  return (
    <div className="card" style={{ gridColumn: "1 / -1" }}>
      <div className="section-title">Map & Waypoints</div>
      <div id="map"></div>
    </div>
  );
}
