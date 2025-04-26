const { Server } = require("socket.io");
const http = require("http");

//const app = express();


const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});


const userSocketMap = {}; // {userId: socketId}

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  // io.emit() est utilisé pour envoyer des événements à tous les clients connectés
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on() est utilisé pour écouter les événements
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = {
  io,
  server,
  getReceiverSocketId,
};
