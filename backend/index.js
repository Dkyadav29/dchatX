const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {
    Server
} = require("socket.io");
//Setting Up CORS Middleware:
app.use(cors());

const server = http.createServer(app);
// cors: Middleware for enabling Cross-Origin Resource Sharing.
//{ Server }: Part of the socket.io library to create a new instance of the 
const io = new Server(server, {
    // Creates a new instance of the Socket.io server and attaches it to the HTTP server. It specifies CORS options to allow communication with http://localhost:3000.
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
//Executes when a client connects via WebSocket. It logs a message indicating the user's socket ID
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });
    // Sending and Receiving Messages: When the server receives a "send_message" event from a client, it broadcasts the received data to all clients in the specified room using socket.to(data.room).emit("receive_message", data).
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });
     // Handling Disconnection:


    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(3001, () => {
    console.log("SERVER RUNNING");
});