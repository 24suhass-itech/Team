import { useState, useEffect } from "react";
import socket from "../socket";

export default function TelemetryPanel() {
  const [t, setT] = useState({});
  const [banner, setBanner] = useState({ msg: "", level: "" });

  useEffect(() => {
    socket.on("telemetry", (data) => {
      setT(data);

      if (data.rssi < 30)
        setBanner({
          msg: "Weak signal (RSSI < 30). Consider switching channel.",
          level: "warn",
        });
      else if (data.battery < 15)
        setBanner({
          msg: "Battery critically low (< 15%). Return to home!",
          level: "danger",
        });
      else setBanner({ msg: "", level: "" });
    });
  }, []);

  const channelSwitch = () => {
    const ch = prompt("Enter new RF channel (1-11):");
    if (!ch) return;
    socket.emit("request_channel_switch", { to_channel: ch });
  };

  return (
    <div className="card">
      <div className="section-title">Telemetry</div>

      {banner.msg && (
        <div className={`banner ${banner.level}`}>{banner.msg}</div>
      )}

      <div className="row">
        <div className="kpi">
          <h4>Latitude</h4>
          <div>{t.lat?.toFixed?.(6) ?? "--"}</div>
        </div>
        <div className="kpi">
          <h4>Longitude</h4>
          <div>{t.lon?.toFixed?.(6) ?? "--"}</div>
        </div>
      </div>

      <div className="row">
        <div className="kpi">
          <h4>Altitude (m)</h4>
          <div>{t.alt ?? "--"}</div>
        </div>
        <div className="kpi">
          <h4>Speed (m/s)</h4>
          <div>{t.speed ?? "--"}</div>
        </div>
      </div>

      <div className="row">
        <div className="kpi">
          <h4>Battery (%)</h4>
          <div>{t.battery ?? "--"}</div>
        </div>
        <div className="kpi">
          <h4>RSSI</h4>
          <div>{t.rssi ?? "--"}</div>
        </div>
      </div>

      <table>
        <tbody>
          <tr>
            <td>Yaw</td>
            <td>{t.orientation?.yaw ?? "--"}</td>
          </tr>
          <tr>
            <td>Pitch</td>
            <td>{t.orientation?.pitch ?? "--"}</td>
          </tr>
          <tr>
            <td>Roll</td>
            <td>{t.orientation?.roll ?? "--"}</td>
          </tr>
        </tbody>
      </table>

      <button className="btn" onClick={channelSwitch}>
        Request Channel Switch
      </button>
    </div>
  );
}
