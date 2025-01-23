module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('chat message', (msg) => {
            io.emit('chat message', msg);
            const message = JSON.stringify(msg)
            console.log('message: ' + message);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:');
        });
    });
};
