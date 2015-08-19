var http = require('http');
var fs = require('fs');
var servName = 'localhost';
var puerto = process.port.ENV || 3000;

var servidor = http.createServer(function(req,res){

	fs.readFile('./index.html',function(error,datos){
		res.writeHead(200,{'Content-Type':'text/html'});
		res.end(datos,'utf-8');
	});

}).listen(puerto,servName);

console.log('servidor funcionando en ' + servName + ':' + puerto);

var io = require('socket.io').listen(servidor);

io.sockets.on('connection',function(elSocket){

	//console.log('El usuario '+ parameters.nombre +' se ha conectado al socket');
	console.log('El usuario se ha conectado al socket');

	elSocket.emit('message',{text:'Te has conectado!'});//mensaje para el usuario

	elSocket.on('respuesta',function(mensaje){
		console.log('Respuesta de un cliente:' + mensaje.text);		
	});

	elSocket.on('nuevo',function(mensaje,funcionDelCliente){
		console.log('Nuevo comentario de un cliente:' + mensaje.text);
		//ahora ejecutamos una funcion en el cliente que nos ha pasado en la llamada
		funcionDelCliente('Comentario recibido por el servidor');		
		elSocket.broadcast.emit('comentario',{text:mensaje.text});//mensaje para todos lo asuario conectados (excepto a este mismo cliente) a este socket.El contenido del mensaje puede ser cualquier cosa.aqui es un objeto con una propiedad text		
		elSocket.emit('comentario',{text:mensaje.text});
	});

	elSocket.on('disconnect',function(){
		console.log('Usuario desconectado');
		elSocket.broadcast.emit('anuncio',{text:'Un usuario se ha desconectado.'});
	});
});