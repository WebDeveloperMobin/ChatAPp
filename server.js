//to make a restApi
let express=require("express");
// "app" is the Rest object which is used to create RestApi
let app=express();
// create a http server to pass the data
let server=require('http').createServer(app);
//pass this server object to socket.io
let io=require('socket.io').listen(server);

// external path
// var path = require('path');
// var filename = path.basename('/chatApp.js');
// console.log(filename);

//Here we will create the 2 array to check the user online or offline
users=[];  //check the users
connections=[]; // check the connection

// here we will create a path to the file 
app.get("/",(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});
// create a socket communication
io.sockets.on('connection',(socket)=>{
    // to add the users into the "users" array we use "push"
    // console.log("connection established")
    connections.push(socket);
    // console.log(" Connected:- " +connections.length);
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('disconnect',(data)=>{
        users.splice(users.indexOf(socket.usersname),1);
        updateUsernames();
     connections.splice(connections.indexOf(socket), 1);
    //  console.log("Disconnected :- " +connections.length)
    console.log('Disconnected: %s socket connected', connections.length)
})
socket.on('send message', function(data){
    // console.log(data);
    io.sockets.emit('new message', {msg: data, user: socket.username});
});
 // for the new user 
 socket.on('new user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
});

// user typing
// socket.on("usertypeOperation", function(data){
//     socket.broadcast.emit("userTyping", data);
//   })

//update the user
function updateUsernames() {
    io.sockets.emit('get users', users);
}
});

server.listen(process.env.PORT || 3000);
console.log("server is listening on port 3000");

