import { Server} from "socket.io";


let connections={}

export const connectToSocket=(server)=>{
    const io=new Server(server,{
        cors:{
            origin:"*",
            methods:["GET","POST"],
            allowedHeaders:["*"],
            credentials:true
        }
    });

    function getAllConnectedClients(meetingID){
        return Array.from(io.sockets.adapter.rooms.get(meetingID) || []).map(
            (socketID)=>{
                return ({
                    socketID,
                    username:connections[socketID]
                })
            }
        )
    }
    

    io.on('connection',(socket)=>{
        socket.on('join',({meetingID,username})=>{
            console.log(socket.id)
            // console.log(name)
            connections[socket.id]=username;
            socket.join(meetingID);
            let clients=getAllConnectedClients(meetingID);
            console.log(clients)
            

            clients.forEach(({socketID})=>{
                io.to(socketID).emit('joined',{
                    clients,
                    username,
                    socketID:socket.id
                })
            })

        })
        socket.on("code-change", ({ code,meetingID }) => {
            console.log(code);
            console.log(meetingID)
            socket.in(meetingID).emit("code-change", { code });
        });

        socket.on('sync-code',({code,socketID})=>{
            io.to(socketID).emit('code-change',{code})
        })

        // socket.on('cursor-position',({position,meetingID})=>{
        //     console.log(connections[socket.id]+ "   " + position.lineNumber + "   " + meetingID)
            
        //     socket.in(meetingID).emit('cursor-position',{username:connections[socket.id],socketID:socket.id,position})
        // })
        socket.on('language-change',({language,meetingID})=>{
            socket.in(meetingID).emit('language-change',{language});
        })

        socket.on('disconnecting',()=>{
            const rooms=[...socket.rooms];
            rooms.forEach((roomId)=>{
                socket.in(roomId).emit('disconnected',{
                    socketID:socket.id,
                    username:connections[socket.id]
                })
            })
            delete connections[socket.id];
            socket.leave();
        })
          
    })
    
}    
        