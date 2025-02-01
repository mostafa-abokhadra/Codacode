const messageController = require('./src/controllers/messagesController')
module.exports = async (io) => {
    io.on('connection', async(socket) => {

        socket.on('joinGroup', async (groupName) => {
            socket.join(groupName)

            // io.in(groupName).fetchSockets().then((sockets) => {
            //     console.log(`Sockets in ${groupName}:`, sockets.map((s) => s.id));
            // });
            
            io.to(groupName).emit('userJoined', {
                message: `a new user has joined the group: ${groupName}`,
                groupName,
            })
        })

        socket.on('sendMessage', async ({groupName, message, project, user}) => {

            const response = await messageController.createMessage(user, message, project)
            console.log('res', response)
            io.to(groupName).emit('sendMessage', {
                message: response.message.content,
                project: project,
                groupName: groupName,
                userSentMessage: response.message.user
            });
        });

        socket.on('leaveGroup', async (groupName) => {

            socket.leave(groupName)
            
            io.to(groupName).emit(`userLeft`, {
                message: `a user has left the group ${groupName}`,
                groupName,
            })
        })

        socket.on('disconnect', async () => {
            console.log('User disconnected:');
        });
    });
};
