const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const inp = document.getElementById("msg")
const typingIndicator = document.getElementById("typing-indicators");
// Get user Name and room from url;
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})
const socket = io();

//join chat room
socket.emit('joinRoom', { username, room })

//Get room and users info
socket.on("roomUsers", ({ room, users }) => {
  outputroomName(room)
  outputUsers(users)
})

//send Bot message to client to server
socket.on("botMessage", message => {
  outputBotMessage(message)
  //Scroll Down 
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

//send user message (client) to server

socket.on('message', message => {
if (message.id === socket.id) {
  outputMyMessage(message)
} else {
  outputUserMessage(message)
  
}
  //Scroll Down 
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

inp.addEventListener('keydown', () => {
  socket.emit('typing');
});
inp.addEventListener('keyup', () => {
  socket.emit('stopTyping');
});

// message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value
  socket.emit('chatMessage', msg)
  socket.emit('stopTyping');
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
})


// Listen for 'userTyping' event and display the typing indicator
socket.on('userTyping', (username) => {
  typingIndicator.innerHTML = `${username} is typing...`
});

// Listen for 'userStoppedTyping' event and remove the typing indicator
socket.on('userStoppedTyping', (username) => {
  typingIndicator.innerHTML = ""
});



// Output Bot message to Dom
const outputBotMessage = (message) => {
  const div = document.createElement('div');
  div.classList.add('bot-notification');
  div.innerHTML = `<div class="bot-message bot-animation">
  <p class="bot-name">${message.userName}</p>
  <p class="bot-chat">${message.chat}</p>
  <div class="time">${message.time}</div>
</div>`

  document.querySelector(".chat-messages").appendChild(div)
}

//out put my message into DOM

const outputMyMessage = (message) => {
  const div = document.createElement('div');
  div.classList.add('my-chat');
  div.innerHTML = `<div class="message my-animation"><p class="text">${message.chat}</p>
<div class="time">${message.time}</div></div>`;
  document.querySelector(".chat-messages").appendChild(div)

}
//output User Message to DOM

const outputUserMessage = (message) => {
  const div = document.createElement('div');
  div.classList.add('others-chat');
  div.innerHTML = `<div class="message others-animation">
  <p class="meta">${message.userName}</p>
  <p class="text">
  ${message.chat}
  </p>
  <div class="time">${message.time}</div>
</div>`;


  document.querySelector(".chat-messages").appendChild(div)
}



// Add room name to DOM

const outputroomName = (room) => {
  roomName.innerHTML = room
}
//Add users to DOM
const outputUsers = (users) => {
  userList.innerHTML = `${users.map(user => `<li class="new-user-animation">${user.username}</li>`).join('')}`
}