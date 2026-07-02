let robotsContainer;
let ftcRobots;
let frcRobots;

async function initRobotCards() {
    await createRobotCards();

    robotsContainer = document.getElementById('robot-container');
    ftcRobots = robotsContainer.querySelectorAll('.ftc');
    frcRobots = robotsContainer.querySelectorAll('.frc');
}

async function createRobotCards() {
    // ROBOT CARDS
    const response = await fetch("/api/robots");
    const robots = await response.json();

    robots.forEach(robot => {
        const season = robot.season;
        const cls = season.toLowerCase();
        const card = `
            <button class="card ${cls}" popovertarget="${robot.id}-popover">
                <img src="${robot.picture}" alt="Robot Picture">
                <div class="text-box">
                    <h3>${robot.name}</h3>
                    <p>${robot.year} | ${robot.season}</p>
                </div>
            </button>
            <div class="card" id="${robot.id}-popover" popover>
                <div class="card-info">
                    <h1 class="card-title">${robot.name}</h1>
                    <p class="card-description">
                        Explore this high-fidelity 3D asset directly inside your browser. Drag to orbit around the character, scroll to zoom, or watch it spin automatically. Source files and updates are available on GitHub.
                    </p>
                    <a href="#" target="_blank" class="github-btn">
                        View on GitHub
                    </a>
                </div>

                <div class="card-viewer">
                    <model-viewer 
                        src="/uploads/robots/models/2025-ftc-marooned.glb" 
                        alt="${robot.name} Interactive 3D Model" 
                        camera-controls 
                        auto-rotate 
                        shadow-intensity="1.5"
                        interaction-prompt="none">
                    </model-viewer>
                </div>
            </div>
        `;
        
        const container = document.getElementById("robot-container");

        container.innerHTML += card;
    });
}

initRobotCards();

function showFrcRobots() {
    ftcRobots.forEach(element => {
        element.classList.add('hidden');
    });
    frcRobots.forEach(element => {
        element.classList.remove('hidden');
    });
}
function showFtcRobots() {
    ftcRobots.forEach(element => {
        element.classList.remove('hidden');
    });
    frcRobots.forEach(element => {
        element.classList.add('hidden');
    });
}