const canvas = document.getElementById("header-bg");
const ctx = canvas.getContext("2d");

let time = 0;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const boatImage = new Image();
boatImage.src = '/assets/images/pirate-ship-vector.png';
boatImage.onload = () => {
    animate();
};

function drawSky() {
    const g=ctx.createLinearGradient(0,0,0,canvas.height);
    g.addColorStop(0, "#090a1e"); // darker top
    g.addColorStop(0.6, "#1b1b4b");
    g.addColorStop(1, "#311d66"); // sci-fi purple-tinted horizon
    ctx.fillStyle=g;
    ctx.fillRect(0,0,canvas.width,canvas.height);
}
function waveY(x,offset=0){
    return canvas.height*.68
        +(Math.sin(x*.008+time+offset)*12
        +Math.sin(x*.018+time*1.5+offset)*5) * 2;
}
function drawOcean() {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);

    for (let x = 0; x <= canvas.width; x += 5) {
        ctx.lineTo(x, waveY(x));
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    const g = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
    g.addColorStop(0, "#1072b4"); // Neon cyan-blue crest
    g.addColorStop(0.5, "#0b3966");
    g.addColorStop(1, "#040f21"); // Deep dark abyss

    ctx.fillStyle = g;
    ctx.fill();
}
function drawRobotBoat(xPercent, isFlipped = false) {
    const x = canvas.width * xPercent;
    const y = waveY(x);
    const sampleOffset = 5;
    const yAhead = waveY(x + sampleOffset);
    const angle = (Math.atan2(yAhead - y, sampleOffset)) * 0.3;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    if (isFlipped) {
        ctx.scale(-1, 1);
    }

    const boatWidth = window.innerWidth/6;
    const boatHeight = window.innerWidth/4;
    ctx.drawImage(boatImage, -boatWidth / 2, -boatHeight + 50, boatWidth, boatHeight);
    ctx.restore();
}

function animate() {
    requestAnimationFrame(animate);

    time -= 0.01;

    drawSky();
    drawOcean();
    drawRobotBoat(0.15, false);
}