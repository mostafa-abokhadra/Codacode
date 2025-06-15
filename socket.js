const messageController = require('./src/controllers/messagesController')
module.exports = async (wsServer) => {
    wsServer.on('connection', async(socket) => {

        socket.on('joinGroup', async (groupName) => {
            socket.join(groupName)
            // wsServer.in(groupName).fetchSockets().then((sockets) => {
            //     console.log(`Sockets in ${groupName}:`, sockets.map((s) => s.id));
            // });
            
            wsServer.to(groupName).emit('userJoined', {
                message: `a new user has joined the group: ${groupName}`,
                groupName,
            })
        })

        socket.on('sendMessage', async ({groupName, message, project, user}) => {

            const response = await messageController.createMessage(user, message, project)
            wsServer.to(groupName).emit('sendMessage', {
                message: response.message.content,
                project: project,
                groupName: groupName,
                userSentMessage: response.message.user
            });
        });

        socket.on('leaveGroup', async (groupName) => {
            socket.leave(groupName)
            wsServer.to(groupName).emit(`userLeft`, {
                message: `a user has left the group ${groupName}`,
                groupName,
            })
        })

        socket.on('disconnect', async () => {
            console.log('User disconnected:');
        });
    });
};
