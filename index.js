const ws = require('ws');
const wss = new ws.Server({ port: 8080 });

const streamers = {};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);
    if (data.type === 'streamer') {
      streamers[data.id] = ws;
    } else if (data.type === 'viewer') {
      const streamer = streamers[data.id];
      console.log('viewer', data);
      if (streamer) {
        streamer.send(JSON.stringify({ type: 'viewer', id: data.id }));
      }
    } else if(data.type === 'chat') {
      console.log('chat', data);
      //send to all viewers
      wss.clients.forEach(function each(client) {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify({ type: 'chat', chat: data.chat }));
        }
      });
    }
  });
    
  
  ws.on('close', function close() {
    
  });

  }
);

