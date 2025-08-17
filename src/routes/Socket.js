const socket = require('socket.io');

const HandleSocket=(server)=>{
    const io=socket(server,{
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('joinRoom', ({ userId, targetUserId }) => {
    console.log(`Received joinRoom request - userId: ${userId}, targetUserId: ${targetUserId}`);
    const roomId=[userId, targetUserId].sort().join('-');
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  // Handle sending messages
  socket.on('sendMessage', (messageData) => {
    console.log('Received message:', messageData);
    const { senderId, receiverId } = messageData;
    const roomId = [senderId, receiverId].sort().join('-');
    
    // Broadcast the message to all users in the room (including sender for confirmation)
    io.to(roomId).emit('receiveMessage', messageData);
    console.log(`Message sent to room ${roomId}:`, messageData);
  });

  // Handle typing indicators
  socket.on('typing', ({ userId, targetUserId, isTyping }) => {
    const roomId = [userId, targetUserId].sort().join('-');
    // Send typing indicator to other users in the room (not the sender)
    socket.to(roomId).emit('userTyping', { userId, isTyping });
    console.log(`Typing indicator sent to room ${roomId}: ${userId} is ${isTyping ? 'typing' : 'not typing'}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

});
}

module.exports = HandleSocket;

