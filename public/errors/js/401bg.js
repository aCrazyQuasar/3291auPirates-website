const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const stars = [];
const clouds = [];

for(let i=0;i<80;i++){
    stars.push({
        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height*0.5,
        size:Math.random()*2+1,
        twinkle:Math.random()*Math.PI*2
    });
}

for(let i=0;i<5;i++){
    clouds.push({
        x:Math.random()*canvas.width,
        y:50+Math.random()*180,
        speed:0.15+Math.random()*0.25,
        size:120+Math.random()*120
    });
}

let time = 0;

function waveY(x){
    return canvas.height*0.72
        + Math.sin(x*0.01+time)*12
        + Math.sin(x*0.023+time*1.7)*6;
}

function drawSky(){

    let grad = ctx.createLinearGradient(0,0,0,canvas.height);

    grad.addColorStop(0,"#081424");
    grad.addColorStop(.55,"#17395f");
    grad.addColorStop(1,"#406e8e");

    ctx.fillStyle=grad;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    stars.forEach(s=>{
        let a=.4+.6*Math.sin(time*2+s.twinkle);
        ctx.globalAlpha=a;

        ctx.fillStyle="white";
        ctx.beginPath();
        ctx.arc(s.x,s.y,s.size,0,Math.PI*2);
        ctx.fill();
    });

    ctx.globalAlpha=1;
}

function drawCloud(cloud){

    ctx.fillStyle="rgba(255,255,255,.12)";

    const x=cloud.x;
    const y=cloud.y;
    const s=cloud.size;

    ctx.beginPath();

    ctx.arc(x,y,s*.25,0,Math.PI*2);
    ctx.arc(x+s*.18,y-10,s*.3,0,Math.PI*2);
    ctx.arc(x+s*.42,y,s*.26,0,Math.PI*2);

    ctx.fill();

    cloud.x+=cloud.speed;

    if(cloud.x>canvas.width+s)
        cloud.x=-s;
}

function drawOcean(){

    ctx.beginPath();

    ctx.moveTo(0,canvas.height);

    for(let x=0;x<=canvas.width;x+=8){
        ctx.lineTo(x,waveY(x));
    }

    ctx.lineTo(canvas.width,canvas.height);

    const grad=ctx.createLinearGradient(0,canvas.height*.7,0,canvas.height);

    grad.addColorStop(0,"#0d5f8c");
    grad.addColorStop(1,"#03273f");

    ctx.fillStyle=grad;
    ctx.fill();

    ctx.strokeStyle="rgba(255,255,255,.12)";
    ctx.lineWidth=2;

    ctx.beginPath();

    for(let x=0;x<canvas.width;x+=12){
        ctx.lineTo(x,waveY(x));
    }

    ctx.stroke();
}

function drawShip(){

    const x=canvas.width*.10;
    const y=waveY(x)-25+Math.sin(time*2)*4;
    const rot=Math.sin(time*1.5)*0.04;

    ctx.save();

    ctx.translate(x,y);
    ctx.rotate(rot);

    // Hull

    ctx.fillStyle="#4e2d15";

    ctx.beginPath();

    ctx.moveTo(-90,0);
    ctx.lineTo(-60,25);
    ctx.lineTo(60,25);
    ctx.lineTo(90,0);
    ctx.closePath();

    ctx.fill();

    ctx.fillStyle="#6b4022";
    ctx.fillRect(-70,-8,140,10);

    // Mast

    ctx.fillStyle="#9c784e";
    ctx.fillRect(-3,-100,6,100);

    // Sail

    ctx.fillStyle="#efe7d1";

    ctx.beginPath();
    ctx.moveTo(0,-95);
    ctx.lineTo(55,-65);
    ctx.lineTo(0,-35);
    ctx.closePath();
    ctx.fill();

    // Flag

    let flap=Math.sin(time*10)*8;

    ctx.fillStyle="#111";

    ctx.beginPath();
    ctx.moveTo(3,-100);
    ctx.lineTo(35+flap,-90);
    ctx.lineTo(3,-80);
    ctx.closePath();

    ctx.fill();

    ctx.fillStyle="white";
    ctx.font="12px serif";
    // ctx.fillText("☠",12,-84);

    ctx.restore();
}

function drawChest(){

    const x=canvas.width*.90;
    const y=waveY(x)-5+Math.sin(time*2.4+2)*5;

    ctx.save();

    ctx.translate(x,y);

    ctx.fillStyle="#70411d";
    ctx.fillRect(-28,-18,56,36);

    ctx.fillStyle="#9d6a2d";
    ctx.fillRect(-28,-20,56,10);

    ctx.strokeStyle="#d5b048";
    ctx.lineWidth=3;
    ctx.strokeRect(-28,-18,56,36);

    // Lock

    ctx.fillStyle="#ffd54d";

    ctx.fillRect(-5,-2,10,14);

    ctx.beginPath();
    ctx.arc(0,-5,7,Math.PI,0);

    ctx.strokeStyle="#ffd54d";
    ctx.lineWidth=3;
    ctx.stroke();

    ctx.restore();
}

function drawFog(){

    let g=ctx.createLinearGradient(0,canvas.height*.55,0,canvas.height);

    g.addColorStop(0,"rgba(255,255,255,0)");
    g.addColorStop(.5,"rgba(255,255,255,.05)");
    g.addColorStop(1,"rgba(255,255,255,.12)");

    ctx.fillStyle=g;
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function animate(){

    time+=0.01;

    drawSky();

    clouds.forEach(drawCloud);

    drawOcean();

    drawShip();

    drawChest();

    drawFog();

    requestAnimationFrame(animate);
}

animate();