const express = require('express');
const app = express();

const server = app.listen(3000, () => {
	console.log('listening on port :3000')
});

const socket = require('socket.io');

const io = socket(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
	console.log('user connected:' + socket.id);

	socket.on('press-key', payload => {
		socket.broadcast.emit('press-key', payload);
		console.log("broadcasting" + payload);
	})

	socket.on('press-key2', payload => {
		socket.broadcast.emit('press-key2', payload);
		console.log("broadcasting" + payload);
	})

	socket.on('seq-start', payload => {
		socket.broadcast.emit('seq-start', payload);
		console.log("broadcasting" + payload);
	})

	socket.on('seq-stop', payload => {
		socket.broadcast.emit('seq-stop', payload);
		console.log("stop broadcasting!")
	})

	socket.on('seq-send', payload => {
		socket.broadcast.emit('seq-send', payload);
		console.log("broadcasting" + payload);
	})
})

