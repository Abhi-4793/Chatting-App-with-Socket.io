import { useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Chat from "./chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showchat, setShowchat] = useState(false);
  const joinedRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("joined-room", room);
      setShowchat(true);
    }
  };

  return (
    <div className="App">
      {!showchat ? (
        <div className="joinChatContainer">
          <h3 className="head">Joined Our ChatRoom</h3>
          <input
            type="text"
            className="user"
            placeholder="Type Your name..."
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            type="text"
            className="room"
            placeholder="Room ID"
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          />
          <button className="joinButton" onClick={joinedRoom}>
            Join A room
          </button>
        </div>
      ) : (
        <div>
          <h1 className="roomid">
            Room Id:<span className="idnum">{room}</span>
          </h1>
          <Chat socket={socket} username={username} room={room} />
        </div>
      )}
    </div>
  );
}

export default App;
