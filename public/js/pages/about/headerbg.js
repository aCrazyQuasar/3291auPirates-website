import { drawBeach, drawOcean, drawBoat, SkyModes, drawSky } from "/js/components/headerAnimations.js";

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
    const groundHeight = (canvas.height * groundPercent) - 30;
    
    ctx.reset();

    drawSky(canvas, ctx, SkyModes.NIGHT);

    drawOcean(canvas, ctx, groundPercent, time);
    drawBoat(canvas, ctx, 0.85, groundPercent, true, time);
    const x2 = canvas.width * 0.75;
    drawBeach(canvas, ctx, 0, x2, groundHeight, time);

    requestAnimationFrame(animate);
}
animate();