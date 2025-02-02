const WebSocket = require('ws');

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        // Handle incoming messages and broadcast to other clients if necessary
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

const handleUpgrade = (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
};

module.exports = { wss, handleUpgrade };