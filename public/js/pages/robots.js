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
            <div class="card ${cls}">
                <img src="${robot.picture}" alt="Robot Picture">
                <div class="text-box">
                    <h3>${robot.name}</h3>
                    <p>${robot.year} | ${robot.season}</p>
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