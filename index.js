const ws = require('ws');
const wss = new ws.Server({ port: 8081 });

const streamers = {};

const viewersOnStream = {};

wss.on('connection', function connection(ws) {


  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);
    
    if(data.type === 'join') {
      viewersOnStream[data.streamer] = viewersOnStream[data.streamer] || [];
      viewersOnStream[data.streamer].push(ws);

      //viewer count
      const viewerCount = viewersOnStream[data.streamer].length;

      //send to all viewers
      viewersOnStream[data.streamer].forEach((viewer) => {
        viewer.send(JSON.stringify({ type: 'viewerCount', viewerCount }));
      });

    } else if (data.type === 'streamer') {
      streamers[data.id] = ws;
    } else if (data.type === 'viewer') {
      const streamer = streamers[data.id];
      console.log('viewer', data);
      if (streamer) {
        streamer.send(JSON.stringify({ type: 'viewer', id: data.id }));
      }
    } else if(data.type === 'chat') {
      console.log('chat', data)

      viewersOnStream[data.streamer].forEach((viewer) => {
        console.log(data.chat);
        viewer.send(JSON.stringify({ type: 'chat', chat: data.chat }));
      });
    }
  });    
  
  ws.on('close', function close() {
    for (const streamer in viewersOnStream) {
      viewersOnStream[streamer] = viewersOnStream[streamer].filter((viewer) => viewer !== ws);
    }
  });

  }
);

