import SVG from "svg.js";

import socketio from "socket.io-client";
import { GameClientController } from "GameClientController";
import { MenuController } from "MenuController";
import { GameViewportController } from "GameViewportController";

if (!SVG.supported) {
    alert("SVG not supported");
    throw new Error("SVG initialization error");
}

const g = SVG("viewport").size($(window).width(), $(window).height());

const urlParts = window.location.href.split("/");
const io = socketio(`${urlParts[0]}//${urlParts[2]}`);

const game = new GameClientController(io);
const menu = new MenuController(game);
const viewport = new GameViewportController(game, io, g);

menu.open();

window.addEventListener("gamepadconnected", (event: any) => {
    console.log("A gamepad connected:");
    console.log(event.gamepad);

    const gamepads = navigator.getGamepads();
    console.log(gamepads);

});

window.addEventListener("gamepaddisconnected", (event: any) => {
    console.log("A gamepad disconnected:");
    console.log(event.gamepad);
});
