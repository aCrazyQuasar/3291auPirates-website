let ftcRobots = [];
let frcRobots = [];
let robotModalIds = [];
let numRobots = 0;
let ftcShown = true;
let frcShown = true;

const frcToggleBtn = document.getElementById('toggle-frc');
const ftcToggleBtn = document.getElementById('toggle-ftc');
const robotCountOut = document.getElementById('num-robots');

async function initRobotCards() {
    let numRobots = await createRobotCards();

    const robotsContainer = document.getElementById('robot-container');
    if (robotsContainer) {
        ftcRobots = robotsContainer.querySelectorAll('.ftc');
        frcRobots = robotsContainer.querySelectorAll('.frc');
    }
    robotCountOut.innerText = numRobots;
}

// Modal stuff
async function showRobotModal(id) {
    if(robotModalIds.includes(id)) {
        const modal = document.getElementById(`${id}-robot-modal`);
        modal.showModal();
    } else {
        try {
            const response = await fetch(`/api/robots/${id}`);
            const robot = await response.json();
            const modalWrapper = document.createElement('div');
            modalWrapper.innerHTML = `
                <dialog id="${robot.id}-robot-modal" class="robot-modal">
                    <div class="info">
                        <h1 class="title">${robot.name}</h1>
                        <p class="description">${robot.description}</p>
                        <div class="btns">
                            <a href="${robot.githubLink}" target="_blank" class="github-btn">
                                View on GitHub
                            </a>
                            <button class="close-btn" commandfor="${robot.id}-robot-modal" command="close">Close</button>
                        </div>
                    </div>
                    <div class="viewer">
                        <model-viewer 
                            src="${robot.model}" 
                            alt="${robot.name} Interactive 3D Model" 
                            camera-controls 
                            auto-rotate 
                            shadow-intensity="1.5"
                            interaction-prompt="none">
                        </model-viewer>
                    </div>
                </dialog>
            `;
            document.body.appendChild(modalWrapper.firstElementChild);
            const modal = document.getElementById(`${id}-robot-modal`);
            modal.showModal();
            robotModalIds.push(id)
        } catch (error) {
            console.error("Failed to load robots:", error);
        }
    }
}

async function createRobotCards() {
    const container = document.getElementById("robot-container");
    container.innerHTML = `
    <l-bouncy
        size="45"
        speed="1.75" 
        color="white" 
    ></l-bouncy>
    `;

    let amt = 0;
    if (!container) return;

    try {
        const response = await fetch("/api/robots");
        const robots = await response.json();

        // 1. Generate all cards in memory using .map()
        const cardsHTML = robots.map(robot => {
            amt += 1;
            const cls = robot.season.toLowerCase();
            
            return `
                <button class="robot-card ${cls}" onclick="showRobotModal(${robot.id})">
                    <img src="${robot.image}" alt="${robot.name} Picture">
                    <div class="text-box">
                        <h4>${robot.name}</h4>
                        <p>${robot.year} | ${robot.season}</p>
                    </div>
                </button>
            `;
        }).join('');

        // 2. Write to the DOM exactly ONCE
        container.innerHTML = cardsHTML;

    } catch (error) {
        console.error("Failed to load robots:", error);
    }
    return amt;
}

// Kick off the initialization
initRobotCards();


frcToggleBtn.addEventListener("click", () => {
    if(!frcShown) {
        toggleRobotVisibility('frc', true);
        frcToggleBtn.classList.add('active');
        frcShown = true;
    } else {
        toggleRobotVisibility('frc', false);
        frcToggleBtn.classList.remove('active');
        frcShown = false;
    }
});
ftcToggleBtn.addEventListener("click", () => {
    if(!ftcShown) {
        toggleRobotVisibility('ftc', true);
        ftcToggleBtn.classList.add('active');
        ftcShown = true;
    } else {
        toggleRobotVisibility('ftc', false);
        ftcToggleBtn.classList.remove('active');
        ftcShown = false;
    }
});


function toggleRobotVisibility(type, show) {
    const targets = type === 'ftc' ? ftcRobots : frcRobots;
    targets.forEach(el => el.classList.toggle('hidden', !show));
}

// Modakl fallback
if (!HTMLButtonElement.prototype.hasOwnProperty('commandForElement')) {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button[commandfor]');
        if (!btn) return;

        const modalId = btn.getAttribute('commandfor');
        const action = btn.getAttribute('command');
        const targetModal = document.getElementById(modalId);

        if (targetModal && targetModal.tagName === 'DIALOG') {
            if (action === 'show-modal') targetModal.showModal();
            if (action === 'close') targetModal.close();
        }
    });
}