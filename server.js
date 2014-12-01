var static = require('node-static');
var http = require('http');
var file = new(static.Server)();
var app = http.createServer(function(req, res) {
    file.serve(req, res);
}).listen(3000);

var io = require('socket.io').listen(app);
io.sockets.on('connection', function(socket) {


    socket.on('message', function(message) {//<----------------RECIBIMOS EL VIDEO
        socket.broadcast.emit('message', message);//<----------ENVIAMOS EL VIDEO
    });

   socket.on('chat', function(message) {
        socket.broadcast.emit('chat', message);//<-------------MANDAMOS EL MENSAJE(TEXTO) A TODOS LOS USUARIOS 
    });

    socket.on('create or join', function(room) {
        var numClients = io.sockets.clients(room).length;//<---CONTAMOS LOS USUARIO EN EL ROOM
        if (numClients === 0) {//<-----------------------------EL ROOM ESTA VACIO
            socket.join(room);//<------------------------------METEMOS EL USUARIO AL ROOM
            socket.emit('created', room);//<-------------------ENVIAMOS MENSAJE DE NUEVA ROOM
        } else if (numClients == 1) {//<-----------------------YA EXISTE EL ROOM PERO AUN HAY ESPACIO
            io.sockets. in (room).emit('join', room);//<-------MANDAMOS UN MENSAJE A LOS USUARIOS EN ESE ROOM
            socket.join(room);//<------------------------------METEMOS EL USUARIO AL ROOM
            socket.emit('joined', room);//<--------------------MANDAMOS MENSAJE A TODOS LOS USUARIOS
        } else {
            socket.emit('full', room);//<----------------------MANDAMOS MENSAJE DE ROOM LLENO
        }
        //socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
        //socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);
    });
});