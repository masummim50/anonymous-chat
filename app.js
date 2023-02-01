const express = require('express');
const app = express();
const cors = require('cors');

const http = require('http');

const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

app.use(express.static(__dirname));
app.use(cors())

app.get("/", (req, res)=> {
    res.sendFile(__dirname+"./index.html")
})


// all socket related stuff down here
var users = {};


io.on('connection', (socket)=> {
    console.log('user connected')

    socket.on('check-username', name=> {
        // console.log(users[name]);
        if(users[name]){
            socket.emit('user-exists');
        }else{
            users[name] = {id: socket.id, name};
            users[socket.id] = name;
            console.log(users);
            socket.emit('user-saved', name);
            io.emit('reload-users', users);
        }
    })


    


    socket.on('disconnect', ()=> {
        const name = users[socket.id];
        delete users[name];
        delete users[socket.id];
        io.emit('reload-users', users);
    })

})









server.listen(5000, ()=> {
    console.log('server running at port 3000')
})
