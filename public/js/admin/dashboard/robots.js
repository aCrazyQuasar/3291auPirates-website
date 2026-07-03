const robotsContainer = document.getElementById('robot-container');;

async function generateRobotCards() {
    robotsContainer.innerHTML = '';
    await createRobotCards();
}

async function createRobotCards() {
    // ROBOT CARDS
    const response = await fetch("/api/robots");
    const robots = await response.json();

    robots.forEach(robot => {
        const season = robot.season;
        const cls = season.toLowerCase();
        const card = `
            <div class="robot-card ${cls}">
                <img src="${robot.image}" alt="${robot.name} Picture">
                <div class="text-box">
                    <h3>${robot.name}</h3>
                    <p>${robot.year} | ${robot.season}</p>
                </div>
                <div class="btns">
                    <button class="edit-btn" popovertarget="${robot.id}-popover">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                    </button>
                    <button class="delete-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    </button>
                </div>
            </div>
            <div class="robot-popover" id="${robot.id}-popover" popover>
                <div class="info">
                    <h1 class="title">${robot.name}</h1>
                    <p class="description">${robot.description}</p>
                    <a href="${robot.githubLink}" target="_blank" class="github-btn">
                        View on GitHub
                    </a>
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
            </div>
        `;
        robotsContainer.innerHTML += card;
    });
}
generateRobotCards();