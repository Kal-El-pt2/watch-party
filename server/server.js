const PORT = process.env.PORT || 3000; 
const io = require('socket.io')(PORT, { 
    cors: { origin: "*" } 
});
const rooms = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        if (rooms[roomId]) socket.emit('sync', rooms[roomId]);
    });

    socket.on('update-state', (data) => {
        rooms[data.roomId] = data;
        socket.to(data.roomId).emit('sync', data);
    });
});
console.log(`Server running on port ${PORT}`);