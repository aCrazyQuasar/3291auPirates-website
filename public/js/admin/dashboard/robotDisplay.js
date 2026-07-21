/*
    to the next dev i am soo sory about this code
    it sucks you and i both know it, so my greatest apologies
    i have no idea what i was doing here and this whole file might just be trash
*/

import { showToast } from "../../components/toast.js";
import { ToastType } from "../../components/toast.js"; 
import { deleteRobot } from "./robotMgr.js";

const robotsContainer = document.getElementById('robot-container');;
let numberOfRobots = 0;
let robotCards;
let robotModalIds = [];

async function generateRobotCards() {
    const modals = document.querySelectorAll(".robot-edit-modal");
    modals.forEach((modal) => {modal.remove()});
    robotModalIds = [];
    robotsContainer.innerHTML = '';
    numberOfRobots = await createRobotCards();
    document.getElementById('robotCount').textContent = numberOfRobots;
    robotCards = robotsContainer.querySelectorAll('.robot-card');
}

async function createRobotCards() {
    robotsContainer.innerHTML = `
    <l-bouncy
        size="45"
        speed="1.75" 
        color="white" 
    ></l-bouncy>
    `;

    let amt = 0;
    try {
        const response = await fetch("/api/robots");
        const robots = await response.json();
        const cardsHTML = robots.map(robot => {
            amt += 1;
            const cls = robot.season.toLowerCase();
            return `
                <div class="robot-card ${cls}">
                    <img src="${robot.image}" alt="${robot.name} Picture">
                    <div class="text-box">
                        <h4>${robot.name}</h4>
                        <p>${robot.year} | ${robot.season}</p>
                    </div>
                    <div class="btns">
                        <button class="edit-btn" data-id="${robot.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                        </button>
                        <button class="delete-btn" data-id="${robot.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                        </button>
                    </div>
                </div>
                
            `;
        }).join('');

        robotsContainer.innerHTML = cardsHTML;
        showToast(ToastType.SUCCESS, "Robots Loaded", "Robots were successfully loaded");
    } catch (error) {
        console.error("Failed to load robots:", error);
        showToast(ToastType.ERROR, "Robots Failed to Load", "Robots were unable to load");
    }
    return amt;
}

async function showRobotEditModal(id) {
    if(robotModalIds.includes(id)) {
        document.getElementById(`${id}-robot-modal`).showModal();
    } else {
        try {
            const response = await fetch(`/api/robots/${id}`);
            if(!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const robot = await response.json();
            const modalWrapper = document.createElement('div');
            modalWrapper.innerHTML = `
                <dialog class="robot-edit-modal" id="${robot.id}-robot-modal">
                    <form class="edit-robot-form" data-robot-id="${robot.id}">
                        <div class="info">
                            <h2 class="title">Edit Robot</h2>
                            
                            <div class="form-group">
                                <label for="edit-name-${robot.id}">Robot Name</label>
                                <input type="text" id="edit-name-${robot.id}" class="edit-name" value="${robot.name}" required>
                            </div>

                            <div class="form-group">
                                <label for="edit-year-${robot.id}">Year</label>
                                <input type="text" id="edit-year-${robot.id}" class="edit-year" value="${robot.year}" required>
                            </div>

                            <div class="form-group">
                                <label for="edit-desc-${robot.id}">Description</label>
                                <textarea id="edit-desc-${robot.id}" class="edit-description" required>${robot.description}</textarea>
                            </div>

                            <div class="form-group">
                                <label for="edit-github-${robot.id}">GitHub URL</label>
                                <input type="url" id="edit-github-${robot.id}" class="edit-githubLink" value="${robot.githubLink || ''}">
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="save-edit-btn">Save Changes</button>
                                <button type="button" commandfor="${robot.id}-robot-modal" command="close" class="cancel-edit-btn">Cancel</button>
                            </div>
                        </div>
                    </form>
                </dialog>
            `;
            document.body.appendChild(modalWrapper.firstElementChild);
            const modal = document.getElementById(`${id}-robot-modal`);
            modal.showModal();
            robotModalIds.push(id)
        } catch (error) {
            console.error("Failed to load robot:", error);
        }
    }
    
}

document.addEventListener("click", (event) => {
    const editBtn = event.target.closest('.edit-btn');
    const deleteBtn = event.target.closest('.delete-btn');

    if (editBtn) {
        const id = editBtn.dataset.id;
        showRobotEditModal(id);
    } else if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        deleteRobot(id);
    }
});

// Search Bar
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
    const searchString = e.target.value.toLowerCase();
    robotCards.forEach((item) => {
        const heading = item.querySelector('h4');
        const headingText = heading.textContent.toLowerCase();
        if (headingText.includes(searchString)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
});

generateRobotCards();

const robotRefreshBtn = document.getElementById('robotRefreshBtn');
robotRefreshBtn.addEventListener('click', () => {
    robotRefreshBtn.disabled = true;
    generateRobotCards();
    robotRefreshBtn.disabled = false;
});

export {generateRobotCards};