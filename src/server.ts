process.env.NODE_PATH = "./dist/server";

import express from "express";
import socketio from "socket.io";
import * as dotenv from "dotenv";
import { GameServerController } from "./controllers/GameServerController";
dotenv.config();

console.log(`Server running in ${process.cwd()}`);

// express web server
const app = express();
app.set("port", process.env.SERVER_PORT);

// http handler
const http = require("http").Server(app);

// ws handler
const io = socketio(http);

app.use(express.static("client/src")); // common cross compiled

// Serve client from two locatiosn ( client and serer common directory )
app.use(express.static("dist/client/client/src"));
app.use(express.static("dist/client/src"));

app.use(express.static("client/static"));
app.use(express.static("client/node_modules/requirejs"));
app.use(express.static("client/node_modules/svg.js/dist"));

app.use(express.static("client/node_modules"));

app.use("/client/src", express.static("client/src"));

const server = http.listen(process.env.SERVER_PORT, () => {
    console.log(`Server listening on *:${process.env.SERVER_PORT}`);
});

const game = new GameServerController(io);
