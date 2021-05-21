import React, { useEffect, useState } from "react";
import "./index.css";
import queryString from "query-string";
import io from "socket.io-client";
import InfoBar from "../Infobar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState('');
  // const ENDPOINT='localhost:5000'

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    const socket = io();
    setSocket(socket);

    setName(name);
    setRoom(room);

    socket.emit("join", { name, room }, () => {});

    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });

    // return () => {
    //   socket.emit("disconnect");
    //   socket.off();
    // };
    // socket.emit('join' , {name,room},({error})=>{
    //         alert(error)
    // })
  }, [location.search]);
  //   useEffect(() => {
  //     const { name, room } = queryString.parse(location.search);
  //     const socket = io();
  //     setSocket(socket);
  //     socket.on('message', message => {
  //         setMessages(messages => [ ...messages, message ]);
  //       });
  //   }, []);
  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      return socket.emit("sendMessage", message, () => setMessage(""));
    }
  };
  console.log(message, messages);

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages name={name} messages={messages} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users}/>
    </div>
  );
};

export default Chat;
