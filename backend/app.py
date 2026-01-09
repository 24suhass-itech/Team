from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS

# ---------------- APP SETUP ----------------

app = Flask(__name__)
CORS(app)

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="threading"
)

# ---------------- TELEMETRY STATE ----------------

latest_telemetry = {
    "lat": 11.06,
    "lon": 77.10,
    "alt": 0.0,
    "speed": 0.0,
    "battery": 100.0,
    "orientation": {
        "yaw": 0.0,
        "pitch": 0.0,
        "roll": 0.0
    },
    "rssi": 100.0
}

# ---------------- REST API (HARDWARE → BACKEND) ----------------

@app.route("/api/telemetry", methods=["POST"])
def receive_telemetry():
    """
    ESP32 / Pixhawk sends telemetry JSON here
    """
    try:
        data = request.get_json(force=True)
        update_telemetry(data)
        return jsonify({"ok": True})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 400


# ---------------- SOCKET.IO (BACKEND → REACT) ----------------

@socketio.on("connect")
def on_connect():
    print("React dashboard connected")
    socketio.emit("telemetry", latest_telemetry)


@socketio.on("request_channel_switch")
def on_channel_switch(data):
    print("Channel switch requested:", data)
    socketio.emit("channel_switch_ack", {
        "ok": True,
        **(data or {})
    })


# ---------------- HELPERS ----------------

def update_telemetry(data):
    global latest_telemetry

    for key in latest_telemetry:
        if key in data and key != "orientation":
            latest_telemetry[key] = data[key]

    if "orientation" in data and isinstance(data["orientation"], dict):
        latest_telemetry["orientation"].update(data["orientation"])

    socketio.emit("telemetry", latest_telemetry)


# ---------------- MAIN ----------------

if __name__ == "__main__":
    print("\nDrone Base Station Backend Running")
    print("Socket.IO -> http://127.0.0.1:5000")
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
