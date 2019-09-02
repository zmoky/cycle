import ResizeObserver from "resize-observer-polyfill";
import $ from "jquery";

$("body").append(`
<div id="test"
style="border: 1px solid #000000; width: 400px; height: 400px; top: 10px; left: 10px; position: absolute; display: block;">
</div>
<label id="test-area"
style="border: 1px solid #ff0000; top: 10px; left: 10px; position: absolute; display: block;">
</label>
`);

const ro = new ResizeObserver((entries, observer) => {
    for (const entry of entries) {
        const { left, top, width, height } = entry.contentRect;

        document.getElementById("test-area").style.fontSize = `${10 + top + 1}px`;
        document.getElementById("test-area").style.left = `${10 + left + 1}px`;
        document.getElementById("test-area").style.width = `${width - 2}px`;
        document.getElementById("test-area").style.height = `${height - 2}px`;
    }
});

ro.observe(document.getElementById("test"));

setInterval(() => {
    const rx = Math.random() * 700;
    const ry = Math.random() * 700;

    $("#test").width(`${rx}px`);
    $("#test").height(`${ry}px`);

}, 0);

export default () => {
    //
};
