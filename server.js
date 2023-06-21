const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const cors = require("cors")

const server = http.createServer(app)
const formatMessage = require('./utils/formatMessage')
const { userJoin, getcurrentUser, userleave, getroomUsers } = require('./utils/users')
const socketio = require('socket.io');
const io = socketio(server)
const botName = 'Buzz Bot'
require('dotenv').config()
const PORT = process.env.PORT
//set static folder 
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

// run when client connect to server
io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)

        socket.emit('botMessage', formatMessage(socket.id,botName, `Hi ${user.username}, Welcome to ${user.room} room`))

        //boradcast when a client connected to server
        socket.broadcast.to(user.room).emit('botMessage', formatMessage(socket.id,botName, `${user.username} has Join the chat`))
        // User and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getroomUsers(user.room)
        })
    })

    //listen for message from client
    socket.on('chatMessage', msg => {
        const user = getcurrentUser(socket.id)
            io.to(user.room).emit('message', formatMessage(socket.id,user.username, msg))
    
    })


    //boradcast when a client disconnected to server
    socket.on('disconnect', () => {
        const user = userleave(socket.id);
        if (user) {
            io.to(user.room).emit("botMessage", formatMessage(socket.id,botName, `${user.username} has left the chat`))
            // User and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getroomUsers(user.room)
            })
        }
    })

})

server.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT: ${PORT}`))