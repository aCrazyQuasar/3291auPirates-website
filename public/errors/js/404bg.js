const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

let time = 0;

// Clouds
const clouds = [];
for (let i = 0; i < 8; i++) {
    clouds.push({
        x: Math.random() * canvas.width,
        y: 40 + Math.random() * 120,
        size: 60 + Math.random() * 70,
        speed: 0.2 + Math.random() * 0.4
    });
}

function drawWaveLayer(baseY, amp, freq, speed, color){

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);

    for(let x=0;x<=canvas.width;x+=6){

        const y =
            baseY +
            Math.sin(x*freq + time*speed) * amp +
            Math.sin(x*freq*0.42 + time*speed*0.6) * amp*0.5 +
            Math.sin(x*freq*1.9 + time*speed*1.3) * amp*0.2;

        ctx.lineTo(x,y);
    }

    ctx.lineTo(canvas.width,canvas.height);
    ctx.closePath();

    ctx.fillStyle=color;
    ctx.fill();
}

function drawCloud(cloud) {

    const g = ctx.createRadialGradient(
        cloud.x,
        cloud.y,
        cloud.size * 0.2,
        cloud.x,
        cloud.y,
        cloud.size
    );

    g.addColorStop(0, "rgba(255,255,255,.95)");
    g.addColorStop(.7, "rgba(255,255,255,.75)");
    g.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = g;

    const p = [
        [-0.45,0.05,.28],
        [-0.18,-0.15,.34],
        [0.10,-0.08,.42],
        [0.42,0.03,.30],
        [0.18,0.12,.35],
        [-0.15,0.12,.32]
    ];

    p.forEach(c=>{
        ctx.beginPath();
        ctx.arc(
            cloud.x + c[0]*cloud.size,
            cloud.y + c[1]*cloud.size,
            c[2]*cloud.size,
            0,
            Math.PI*2
        );
        ctx.fill();
    });
}

function draw() {

    time += 0.015;

    // Sky
    const sky = ctx.createLinearGradient(0,0,0,canvas.height);
    sky.addColorStop(0,"#73c9ff");
    sky.addColorStop(1,"#d9f3ff");

    ctx.fillStyle = sky;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Sun
    ctx.beginPath();
    ctx.fillStyle="#ffe27a";
    ctx.arc(canvas.width*0.8,100,50,0,Math.PI*2);
    ctx.fill();

    // Clouds
    clouds.forEach(c=>{
        c.x += c.speed;

        if(c.x-c.size>canvas.width)
            c.x=-c.size*2;

        drawCloud(c);
    });

    // Ocean
    ctx.fillStyle="#1f78b8";
    ctx.fillRect(0,canvas.height*.55,canvas.width,canvas.height);

    // Waves
    drawWaveLayer(canvas.height*.57,14,.018,2.0,"#2f9dd8");
    drawWaveLayer(canvas.height*.60,18,.014,1.5,"#2488c8");
    drawWaveLayer(canvas.height*.64,24,.011,1.1,"#1d6fae");
    drawWaveLayer(canvas.height*.69,30,.009,.8,"#15598d");

    requestAnimationFrame(draw);
}

draw();