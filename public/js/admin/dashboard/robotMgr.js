// ---------- ADD ROBOTS ----------
const addRobotBtn = document.getElementById('addRobotBtn');
const addRobotModal = document.getElementById('addRobotModal');
const closeRobotModal = document.getElementById('closeRobotModalBtn');
addRobotBtn.addEventListener("click", () => {
    addRobotModal.showModal();
});
closeRobotModal.addEventListener("click", () => {
    addRobotModal.close();
});

// --- Image Drop Zone Elements ---
const imageFile = document.getElementById('imageFile');
const imageDropZoneText = document.querySelector('#imageDropZone .drop-zone-text');
const imagePreview = document.querySelector('#imageDropZone .preview-img');
imageFile.addEventListener('change', () => {
    if (imageFile.files.length > 0) {
        const file = imageFile.files[0];
        imageDropZoneText.textContent = file.name;
        
        // Read and display image background preview
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
});

// --- Model Drop Zone Elements ---
const modelFile = document.getElementById('modelFile');
const modelDropZoneText = document.querySelector('#modelDropZone .drop-zone-text');
modelFile.addEventListener('change', () => {
    if (modelFile.files.length > 0) {
        // Update text to show the selected .glb file name
        modelDropZoneText.textContent = modelFile.files[0].name;
    }
});

const form = document.getElementById("robotForm");
const submitBtn = document.getElementById("submitBtn");
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.innerText = "Uploading...";

    const imageFileInput = document.getElementById("imageFile");
    const modelFileInput = document.getElementById("modelFile");
    const imageFile = imageFileInput.files[0];
    const modelFile = modelFileInput.files[0];

    if (!imageFile || !modelFile) {
        alert("Please select both a .png image and a .glb 3D model.");
        submitBtn.disabled = false;
        submitBtn.innerText = "Save Robot";
        return;
    }

    try {
        // Make form data
        const formData = new FormData();
        formData.append("name", document.getElementById("name").value);
        formData.append("year", document.getElementById("year").value);

        const selectedSeason = document.querySelector('input[name="season"]:checked');
        formData.append("season", selectedSeason ? selectedSeason.value : "");

        formData.append("description", document.getElementById("description").value);
        formData.append("githubLink", document.getElementById("githubLink").value || "");
        formData.append("imageFile", imageFile);
        formData.append("modelFile", modelFile);

        const dbResponse = await fetch("http://localhost:3000/api/robots", {
            method: "POST",
            body: formData // Note: DO NOT set Content-Type header manually, the browser handles it automatically for FormData!
        });

        if (dbResponse.ok) {
            alert("🎉 Robot successfully uploaded and written to database!");

            // Reset the form
            form.reset();
            document.querySelectorAll(".drop-zone").forEach(dropZone => {
                const textSpan = dropZone.querySelector(".drop-zone-text");
                if (textSpan) {
                    if (dropZone.id === "imageDropZone") {
                        textSpan.innerText = "Drop image here or click to upload";
                    } else if (dropZone.id === "modelDropZone") {
                        textSpan.innerText = "Drop 3D model here or click to upload";
                    }
                }
                const preview = dropZone.querySelector(".preview-img");
                if (preview) {
                    preview.innerHTML = ""; 
                    preview.style.backgroundImage = "none"; // Clears it if you set it as a background image
                }
            });
        } else {
            const errData = await dbResponse.json();
            alert(`Upload failed: ${errData.error}`);
        }
    } catch (error) {
        console.error(error);
        alert(`Error: ${error.message}`);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Save Robot";
        addRobotModal.close();
    }   
});

// ---------- EDIT ROBOTS ---------- 
document.addEventListener('submit', async (event) => {
    if (!event.target.matches('.edit-robot-form')) return;
    event.preventDefault(); 
    const form = event.target;
    const submitBtn = form.querySelector('.save-edit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Uploading...";
    }
    try {
        const id = form.dataset.robotId; 

        let formData = new FormData();
        formData.append("name", form.querySelector('.edit-name')?.value || "");
        formData.append("year", form.querySelector('.edit-year')?.value || "");
        formData.append("description", form.querySelector('.edit-description')?.value || "");
        formData.append("githubLink", form.querySelector('.edit-githubLink')?.value || "");

        const response = await fetch(`/api/robots/${id}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        form.reset();
        alert('success editing');
        generateRobotCards();

    } catch (error) {
        console.error("Failed to update robot:", error);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = "Save";
        }
    }
});

// ---------- DELETE ROBOTS ---------- 
async function deleteRobot(id) {
    try{
        const response = await fetch(`/api/robots/${id}`, {
            method: 'DELETE'
        });

        if(!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        generateRobotCards();
        if (response.status !== 204) {
            const data = await response.json();
            console.log('Deleted successfully:', data);
        } else {
            console.log('Deleted successfully (No Content).');
        }
    } catch (error) {
        console.error('Failed to delete robot:', error);
    }
}