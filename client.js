const socket = io();

/* Elements */
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messagecontainer = document.querySelector(".container");

/* Get User Name */
const name = prompt("Enter your name to join");
if(!name){
  alert("Name is required");
  location.reload();
}

socket.emit("new-user-joined", name);

/* Message Append */
const append = (message, position)=>{
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messagecontainer.append(messageElement);

  messagecontainer.scrollTop = messagecontainer.scrollHeight;
};

/* Center Message */
const appendCenter = (message)=>{
  const div = document.createElement("div");
  div.classList.add("center");
  div.innerHTML = `<span class="message">${message}</span>`;
  messagecontainer.append(div);

  messagecontainer.scrollTop = messagecontainer.scrollHeight;
};

/* Send Message */
form.addEventListener("submit", (e)=>{
  e.preventDefault();

  const message = messageInput.value.trim();
  if(!message) return;

  append(`You: ${message}`, "right");
  socket.emit("send", message);

  messageInput.value = "";
});

/* Old Messages */
socket.on("old-messages", (messages)=>{
  messages.forEach(msg=>{
    if(msg.name === name){
      append(`You: ${msg.message}`, "right");
    }else{
      append(`${msg.name}: ${msg.message}`, "left");
    }
  });
});

/* Receive Message */
socket.on("receive", (data)=>{
  if(data.name === name){
    append(`You: ${data.message}`, "right");
  }else{
    append(`${data.name}: ${data.message}`, "left");
  }
});

/* User Join */
socket.on("user-joined", (userName)=>{
  appendCenter(`${userName} joined the chat`);
});

/* User Left */
socket.on("left", (userName)=>{
  appendCenter(`${userName} left the chat`);
});