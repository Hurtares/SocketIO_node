var io = require('socket.io')(process.env.PORT || 52300);

//Custom Classes
var Player = require('./Classes/Player.js');

console.log('Server has started');

var players = [];
var sockets = [];

io.on("connection",function(socket){
    console.log('connection made');

    var player = new Player();
    var thisPlayerID = player.id;

    players[thisPlayerID] = player;
    sockets[thisPlayerID] = socket;

    //Dizer ao client que este é o seu id para o servidor
    socket.emit('register',{id: thisPlayerID});
    
    //diz-me toda a gente que está no servidor
    for(var playerID in players){
        if(playerID != thisPlayerID){
            socket.emit('spawn',players[playerID]);
        }
    }
    socket.emit('spawn',player);//dizer ao player que deu spawn
    socket.broadcast.emit('spawn',player);//dizer a toda a gente que o player deu spawn

    
    

    //Posiçoes
    socket.on('updatePosition',function(data){
        player.position.x = data.position.x;
        player.position.y = data.position.y;

        socket.broadcast.emit('updatePosition',player);
    });
    socket.on('updateBomba',function(data){
        console.log(data);
        socket.broadcast.emit('updateBomba',data);
    });

    socket.on('disconnect',function(){
        console.log('disconect');
        delete players[thisPlayerID];
        delete sockets[thisPlayerID];
        socket.broadcast.emit('disconnected', player);
    });
    socket.on('getTFOut',function(id){
        console.log('disconect');
        delete players[id];
        delete sockets[id];
        socket.broadcast.emit('disconnected', player);
    });
})