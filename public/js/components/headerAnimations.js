function drawBeach(canvas, ctx, x1, x2, groundY, time=undefined) {
    const width = Math.abs(x2 - x1);
    const startX = Math.min(x1, x2);
    const endX = Math.max(x1, x2);
    ctx.save();

    // 1. Main Sand Body
    const sandGradient = ctx.createLinearGradient(0, groundY, 0, canvas.height);
    sandGradient.addColorStop(0, '#f2d680');
    sandGradient.addColorStop(0.5, '#e6c86e');
    sandGradient.addColorStop(1, '#c2a649');

    ctx.fillStyle = sandGradient;
    ctx.beginPath();
    ctx.moveTo(startX, canvas.height);
    ctx.lineTo(startX, groundY);
    ctx.quadraticCurveTo(
        startX + width * 0.45, groundY, 
        endX, canvas.height 
    );
    ctx.lineTo(startX, canvas.height);
    ctx.closePath();
    ctx.fill();

    // 2. Dune Grass Accents (Placed near top-left surface)
    const tuftX = startX + width * 0.18;
    const tuftY = groundY;

    ctx.strokeStyle = '#5b7a1e';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';

    const blades = [-10, -5, 0, 5, 10];
    blades.forEach((offset, idx) => {
        ctx.beginPath();
        ctx.moveTo(tuftX + offset, tuftY);
        
        // Sway grass blades using time variable if defined, or fixed curve
        const sway = (typeof time !== 'undefined') ? Math.sin(time * 2 + idx) * 3 : 0;
        const curve = offset * 0.7 + sway;
        ctx.quadraticCurveTo(
            tuftX + offset + curve, tuftY - 10, 
            tuftX + offset + curve * 1.3, tuftY - 18
        );
        ctx.stroke();
    });
    ctx.restore();
}
function waveY(canvas, ctx, x, percent, time){
    return canvas.height*percent
        +(Math.sin(x*.008+time)*12
        +Math.sin(x*.018+time*1.5)*5) * 2;
}
function drawOcean(canvas, ctx, percent, time) {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);

    for (let x = 0; x <= canvas.width; x += 5) {
        ctx.lineTo(x, waveY(canvas, ctx, x, percent, time));
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

export {drawBeach, drawOcean};