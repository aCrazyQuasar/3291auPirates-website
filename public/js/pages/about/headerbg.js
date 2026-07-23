import { drawBeach, drawOcean } from "/js/components/headerAnimations.js";

const canvas = document.getElementById("header-bg");
const ctx = canvas.getContext("2d");
const groundPercent = 0.75;
let time = 0;

function resize() {
    const parent = canvas.parentElement || document.body;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
}
window.addEventListener("resize", resize);
resize();

function animate() {
    time += 0.01;
    
    ctx.reset();

    drawOcean(canvas, ctx, groundPercent, time);

    requestAnimationFrame(animate);
}
animate();