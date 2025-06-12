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
            console.log(meetingID,"vvvv",username)
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
        
        socket.on('input-field-change',({inputField,meetingID})=>{
            socket.in(meetingID).emit('input-field-change',{inputField});
        })
        socket.on('output-field-change',({outputField,meetingID})=>{
            socket.in(meetingID).emit('output-field-change',{outputField});
        })

        //WHiteBoard handling
        socket.on('enable-whiteboard',({showWhiteBoard,meetingID})=>{
            socket.in(meetingID).emit('enable-whiteboard',{showWhiteBoard});
        })
        socket.on('draw',({offsetX,offsetY,meetingID})=>{
            socket.in(meetingID).emit('ondraw',{offsetX,offsetY})
        })
        socket.on('startDrawing',({offsetX,offsetY,meetingID})=>{
            socket.in(meetingID).emit('startDrawing',{offsetX,offsetY})
        })
        socket.on('eraser',({newColor,isEraser,meetingID})=>{
            socket.in(meetingID).emit('eraser',{newColor,isEraser})
        })
        socket.on('color-width',({color,lineWidth,meetingID})=>{
            socket.in(meetingID).emit('color-width',{color,lineWidth});
        })
        socket.on('all-clear',({meetingID})=>{
            socket.in(meetingID).emit('all-clear');
        })
        socket.on('undo', ({ image,meetingID }) => {
            socket.in(meetingID).emit('undo', { image });
        })
        socket.on('redo', ({ image, meetingID }) => {
            socket.in(meetingID).emit('redo', { image });
        })
        socket.on('snapshot', ({ image, meetingID }) => {
            socket.in(meetingID).emit('snapshot', { image });
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
        