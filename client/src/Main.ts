import SVG from "svg.js";
import socketio from "socket.io-client";

if (!SVG.supported) {
    alert("SVG not supported");
    throw new Error("SVG initialization error");
}

const urlParts = window.location.href.split("/");
const io = socketio(`${urlParts[0]}//${urlParts[2]}`);

window.addEventListener("gamepadconnected", (event: any) => {
    console.log("A gamepad connected:");
    console.log(event.gamepad);

    var gamepads = navigator.getGamepads();
    console.log(gamepads);

});

window.addEventListener("gamepaddisconnected", (event: any) => {
    console.log("A gamepad disconnected:");
    console.log(event.gamepad);
});
