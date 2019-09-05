process.env.NODE_PATH = "./dist/server";

import express from "express";
import socketio from "socket.io";
import * as dotenv from "dotenv";
dotenv.config();

console.log(`Server running in ${process.cwd()}`);

// express web server
const app = express();
app.set("port", process.env.SERVER_PORT);

// http handler
const http = require("http").Server(app);

// ws handler
const io = socketio(http);

app.use(express.static("dist/client"));
app.use(express.static("dist/client/src")); // common cross compiled

app.use(express.static("client/static"));
app.use(express.static("client/node_modules/requirejs"));
app.use(express.static("client/node_modules/svg.js/dist"));

app.use(express.static("client/node_modules"));

app.use("/client/src", express.static("client/src"));


io.on("connection", () => {
    console.log("Client connected");
});

const server = http.listen(process.env.SERVER_PORT, () => {
    console.log(`Server listening on *:${process.env.SERVER_PORT}`);
});

