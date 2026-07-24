// ---------- Land Stuff ----------
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

// ---------- Water Stuff --------
function waveY(canvas, ctx, x, percent, time){
    return canvas.height*percent
        +(Math.sin(x*.008+time)*15);
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
// boat
const boatImage = new Image();
boatImage.src = '/assets/images/pirate-ship-vector.png';
function drawBoat(canvas, ctx, xPercent, yPercent, isFlipped = false, time) {
    const x = canvas.width * xPercent;
    const y = waveY(canvas, ctx, x, yPercent, time);
    const sampleOffset = 5;
    const yAhead = waveY(canvas, ctx, x + sampleOffset, yPercent, time);
    const angle = (Math.atan2(yAhead - y, sampleOffset)) * 0.8;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    if (isFlipped) {
        ctx.scale(-1, 1);
    }

    const boatWidth = canvas.width * 0.15;
    const boatHeight = canvas.width * 0.15;
    ctx.drawImage(boatImage, -boatWidth / 2, -boatHeight + (boatHeight * 0.1), boatWidth, boatHeight);
    ctx.restore();
}

// ---------- Sky stuff ----------
const SkyModes = {
    DAY: "day",
    NIGHT: "night",
    SUNRISE: "sunrise",
    SUNSET: "sunset"
};
function drawSky(canvas, ctx, mode = 'night') {
    const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    const palettes = {
        day: [
            { stop: 0, color: '#1e5799' },   // Deep blue sky top
            { stop: 0.6, color: '#2989d8' }, // Vibrant sky blue
            { stop: 1, color: '#89cff0' }    // Bright horizon
        ],
        night: [
            { stop: 0, color: '#090a1e' },   // Dark cosmic top
            { stop: 0.6, color: '#1b1b4b' }, // Deep indigo mid
            { stop: 1, color: '#311d66' }    // Sci-fi purple-tinted horizon
        ],
        sunrise: [
            { stop: 0, color: '#15173c' },   // Fading night sky
            { stop: 0.5, color: '#883a62' }, // Warm violet-pink
            { stop: 0.8, color: '#f37355' }, // Soft dawn orange
            { stop: 1, color: '#fdd38d' }    // Golden horizon glow
        ],
        sunset: [
            { stop: 0, color: '#1a0933' },   // Deep purple dusk sky
            { stop: 0.45, color: '#682051' },// Rich magenta
            { stop: 0.75, color: '#e85338' },// Radiant sunset orange
            { stop: 1, color: '#fba949' }    // Fiery horizon
        ]
    };

    const activePalette = palettes[mode.toLowerCase()] || palettes.night;
    activePalette.forEach(item => {
        g.addColorStop(item.stop, item.color);
    });

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
export {drawBeach, drawOcean, drawBoat, SkyModes, drawSky};