require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

/* ================= MongoDB Connect ================= */
mongoose.connect("mongodb+srv://siyam:Tl5YsFUapfZrSjnN@cluster0.uh8byi7.mongodb.net/chatApp?appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* ================= Message Schema ================= */
const Message = require("/Message");

//app.use(express.static(path.join(__dirname, "public")));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Index.html");
});

app.use(express.static(__dirname));

const users = {};

io.on("connection", (socket) => {

  socket.on("new-user-joined", async (name) => {
    users[socket.id] = name;

    // পুরনো মেসেজ পাঠানো
    const messages = await Message.find().sort({ time: 1 });
    socket.emit("old-messages", messages);

    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", async (message) => {
    const newMessage = new Message({
      name: users[socket.id],
      message: message
    });

    await newMessage.save();

    socket.broadcast.emit("receive", {
      name: users[socket.id],
      message: message
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });

});

/* ================= Server Listen ================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
