import SVG from "svg.js";

import socketio from "socket.io-client";
import { GameController } from "GameController";
import { MenuController } from "MenuController";

if (!SVG.supported) {
    alert("SVG not supported");
    throw new Error("SVG initialization error");
}

var draw = SVG('viewport').size($(window).width(), $(window).height());
var rect = draw.rect($(window).width(), $(window).height()).attr({ fill: '#0c141f' });

var plo = draw.polyline('').fill('none').stroke({ color: '#df740c', width: 3 });
var plb = draw.polyline('').fill('none').stroke({ color: '#6fc3df', width: 3 });

plo.plot([[400, 400], [400, 800], [250, 800], [250, 700], [50, 700]]);
plb.plot([[900, 100], [1000, 100], [1000, 600], [1300, 600], [1300, 700]]);
// pl.plot([[50, 500], [100, 500], [100, 900], [250, 300], [50, 300]]);


const urlParts = window.location.href.split("/");
const io = socketio(`${urlParts[0]}//${urlParts[2]}`);

const game = new GameController(io);
const menu = new MenuController(game);

menu.openMain();

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
