import { Server, Socket} from "socket.io";

export function handleSockets(io: Server){
    const connectedUsers:Map<string, string> = new Map<string, string>();

    io.on("connection", (socket: Socket) => {
            const user = socket.handshake.query.user as string || '<desconocido>';
            connectedUsers.set(socket.id, user);
            console.log('Socket: ', socket.id, 'User: ', user);
            io.emit('users:update', {users: [...connectedUsers.values()]});

            setTimeout(() => {
                socket.emit("connected", {message: "You are connected!"});
            }, 1000);

            socket.on("message", (data) =>{
                console.log(`${socket.id}: ${data}`); 
            io.emit("message", {
                socketId: socket.id,
                user: user,
                time: Date.now(),
                message: data
            });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            connectedUsers.delete(socket.id);
            io.emit('users:update', connectedUsers.entries());
        });
    });
}