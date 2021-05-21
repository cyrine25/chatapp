// const http = require('http');
// const express = require("express")
// const socketio = require("socket.io")
// const router = require("./routes/router")
// const cors = require("cors")
// const {addUser,removeUser,getUser,getUsersInRoom} = require("./users")

// const app = express()
// app.use(express.json())
// app.use(cors())

// const server = http.createServer(app);
// const io = socketio(server);


// app.use(router)

// io.on("connection",socket => {
//   console.log("we have new connection")

//   socket.on("join",({name,room},cb)=>{
//     const {error,user} = addUser({id:socket.id,name,room})
//     if(error) return cb(error);
//     socket.emit("message",{user:"admin",text:`${user.name},Welcome to ${user.room}`});
//     socket.broadcast.to(user.room).emit("message",{user:"admin",text:`${user.name}, has joined`})
//     socket.join(user.room)
//     cb();
//   })

//   socket.on("sendMessage",(message,cb) => {
//     const user = getUser(socket.id)
//     io.to(user.room).emit("message",{user:user.name,text:message})
//     cb()
//   })

//   socket.on("disconnect",() => {
//     console.log("user had left !!! ")
//   })
// })
// const PORT = process.env.PORT || 5000;

// server.listen(PORT,err =>  err ? console.error(err) : console.log(`Server is running on port ${PORT}`))


// const http = require("http");
// const path = require("path");
// const express = require("express");
// const socketio = require("socket.io")

// const app = express();
// const server = http.createServer(app);
// const io = socketio(server)
// const router = require("./routes/router");
// const { disconnect } = require("process");

// app.use(router)

// const PORT = process.env.PORT || 5000;
// io.on("connection",
//  socket => { console.log("New Connection ")
//  socket.on("join",({name,room},cb)=>{
//    console.log(name,room)
//    const error = true;
//    if (error){
//      cb({'error':error})
//    }
//  })
//  socket.on("disconnect",() => {
//      console.log("User had left")
//  })
// });
// server.listen(PORT, (err) =>
//   err ? console.error(err) : console.log(`Server is runnig on port ${PORT}`)
// );
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require("./routes/router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));