const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

let time = 0;

// ---------------------
// Clouds
// ---------------------

const clouds = [];

for(let i=0;i<8;i++){
    clouds.push({
        x:Math.random()*canvas.width,
        y:Math.random()*180,
        speed:.2+Math.random()*.3,
        size:60+Math.random()*60
    });
}

// ---------------------
// Bubbles
// ---------------------

const bubbles=[];

for(let i=0;i<40;i++){
    bubbles.push({
        x:Math.random()*canvas.width,
        y:canvas.height+Math.random()*canvas.height,
        r:2+Math.random()*4,
        speed:.5+Math.random()*1
    });
}

// ---------------------
// Birds
// ---------------------

const birds=[];

for(let i=0;i<6;i++){
    birds.push({
        x:Math.random()*canvas.width,
        y:80+Math.random()*120,
        speed:1+Math.random()
    });
}

let lightning=0;

setInterval(()=>{
    if(Math.random()<0.35)
        lightning=12;
},7000);

// ---------------------

function waveY(x,offset=0){
    return canvas.height*.68
        +Math.sin(x*.008+time+offset)*12
        +Math.sin(x*.018+time*1.5+offset)*5;
}

// ---------------------

function drawSky(){

    const g=ctx.createLinearGradient(0,0,0,canvas.height);

    g.addColorStop(0,"#1f3b68");
    g.addColorStop(.6,"#355d8c");
    g.addColorStop(1,"#6fa0bf");

    ctx.fillStyle=g;
    ctx.fillRect(0,0,canvas.width,canvas.height);

}

// ---------------------

function drawCloud(c){

    ctx.fillStyle="rgba(255,255,255,.75)";

    const s=c.size;

    ctx.beginPath();

    ctx.arc(c.x,c.y,s*.3,0,Math.PI*2);
    ctx.arc(c.x+s*.25,c.y-10,s*.38,0,Math.PI*2);
    ctx.arc(c.x+s*.55,c.y,s*.3,0,Math.PI*2);

    ctx.fill();

    c.x+=c.speed;

    if(c.x>canvas.width+s)
        c.x=-s;

}

// ---------------------

function drawOcean(){

    ctx.beginPath();

    ctx.moveTo(0,canvas.height);

    for(let x=0;x<=canvas.width;x+=8){
        ctx.lineTo(x,waveY(x));
    }

    ctx.lineTo(canvas.width,canvas.height);

    ctx.closePath();

    const g=ctx.createLinearGradient(0,waveY(0),0,canvas.height);

    g.addColorStop(0,"#2573b8");
    g.addColorStop(1,"#0c3155");

    ctx.fillStyle=g;
    ctx.fill();

}

// ---------------------

function drawBird(b){

    b.x+=b.speed;

    if(b.x>canvas.width+50)
        b.x=-50;

    ctx.strokeStyle="#111";
    ctx.lineWidth=2;

    const flap=Math.sin(time*12+b.x*.03)*8;

    ctx.beginPath();
    ctx.moveTo(b.x,b.y);
    ctx.quadraticCurveTo(b.x+8,b.y-flap,b.x+16,b.y);

    ctx.moveTo(b.x+16,b.y);
    ctx.quadraticCurveTo(b.x+24,b.y-flap,b.x+32,b.y);

    ctx.stroke();

}

// ---------------------

function animate(){

    requestAnimationFrame(animate);

    time+=0.01;

    drawSky();

    clouds.forEach(drawCloud);

    birds.forEach(drawBird);

    drawOcean();

    if(lightning>0){

        ctx.fillStyle=`rgba(255,255,255,${lightning/12*.45})`;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        lightning--;

    }

}

animate();