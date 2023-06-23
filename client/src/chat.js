import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import EmojiPicker from "emoji-picker-react";

function Chat({ socket, username, room }) {
  const [currentmessage, setCurrentmessage] = useState("");
  const [listMessage, setListMessage] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setCurrentmessage(currentmessage + emojiObject.emoji);
    console.log(emojiObject.emoji);
    setShowPicker(false);
  };
  const messageSent = async () => {
    if (currentmessage !== "") {
      const messageData = {
        room: room,
        writer: username,
        message: currentmessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setListMessage((message) => [...message, messageData]);
      setCurrentmessage("");
    }
  };
  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setListMessage((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>&#x1F5E8; Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {listMessage.map((mess) => {
            return (
              <div
                className="message"
                id={username === mess.writer ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{mess.message}</p>
                  </div>
                  <div className="message-meta">
                    <p
                      id="time
                  "
                    >
                      {mess.time}
                    </p>
                    <p id="author">{mess.writer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <div className="picker-container">
          <img
            alt="emoji"
            className="emoji-icon"
            src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
            onClick={() => setShowPicker((val) => !val)}
          />
          {showPicker && (
            <EmojiPicker
              height={300}
              width={-200}
              onEmojiClick={onEmojiClick}
            />
          )}
        </div>
        <input
          type="text"
          value={currentmessage}
          placeholder="Enter Message..."
          onChange={(e) => {
            setCurrentmessage(e.target.value);
          }}
          onKeyDown={(event) => {
            event.key === "Enter" && messageSent();
          }}
        />
        <button onClick={messageSent}> &#9658; </button>
      </div>
    </div>
  );
}

export default Chat;
