"use strict";

import express from "express";
import https from "https";
import SocketIO from "socket.io";
import fs from "fs";

const app = express();
const server = https.createServer(
  {
    key: fs.readFileSync("ssl/rootCA.key"),
    cert: fs.readFileSync("ssl/rootCA.crt")
  },
  app
);
// WARNING: app.listen(80) will NOT work here!

const io = SocketIO.listen(server);

let clientCount = 0;

server.listen(4201, "0.0.0.0", () => {
  console.log("start signal server...");
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connect", socket => {
  console.log("Peer connected:", socket.id);
  clientCount = clientCount + 1;
  if(clientCount === 1) {
      socket.emit("Open", {"memberID": socket.id});
  }
  else {
      socket.broadcast.emit("NewMember", {"memberID": socket.id});
  }

  socket.on("icecandidate", data => {
    socket.broadcast.emit("icecandidate", data);
    console.log("icecandidate:", data);
  });

  socket.on("offer", offer => {
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", answer => {
    socket.broadcast.emit("answer", answer);
  });

  socket.on('disconnect', function () {
    clientCount = Math.max(0, clientCount - 1);
  });
});
