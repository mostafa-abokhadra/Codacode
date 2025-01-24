module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('joinGroup', (groupName) => {
            // 2
            console.log('recieved join group request from client')
            socket.join(groupName) // Adds the client to the room.
            console.log('user joined successfully to', groupName)
            // console.log(`user joined group ${groupName}`)
            io.in(groupName).fetchSockets().then((sockets) => {
                console.log(`Sockets in ${groupName}:`, sockets.map((s) => s.id));
            });
            // io.in(groupName).fetchSockets().then((sockets) => {
            //     console.log(`Sockets in ${groupName}:`, sockets.map((s) => s.id));
            // });

            // 3: Broadcasts a userJoined event to the group.
            console.log('sending new user joined event to client')
            io.to(groupName).emit('userJoined', {
                message: `a new user has joined the group: ${groupName}`,
                groupName,
            })
        })

        // 5: Broadcasts the message to all clients in the group via sendMessage.
        socket.on('sendMessage', ({groupName, message, project}) => {
            console.log('message reached the server', message)
            // console.log(`message to ${groupName}: ${message}`)
            console.log('sending the sendMessage event to other client')
            io.to(groupName).emit('sendMessage', {
                message: message,
                project: project,
                groupName: groupName,
            });
        });

        socket.on('leaveGroup', (groupName) => {
            socket.leave(groupName)
            console.log('left group in the server')
            // console.log(`user left group ${groupName}`)
            io.to(groupName).emit(`userLeft`, {
                message: `a user has left the group ${groupName}`,
                groupName,
            })
        })

        socket.on('disconnect', () => {
            console.log('User disconnected:');
        });
    });
};
