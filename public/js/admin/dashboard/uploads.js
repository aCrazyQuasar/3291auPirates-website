// dashboardUploads.js

const form = document.getElementById("robotForm");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Stop standard page reload
  
  submitBtn.disabled = true;
  submitBtn.innerText = "Uploading files and saving robot entry...";

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
    // Pack EVERYTHING into a single modern multipart form body
    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("year", document.getElementById("year").value);
    
    // FIX: Target the checked radio button within the "season" group
    const selectedSeason = document.querySelector('input[name="season"]:checked');
    formData.append("season", selectedSeason ? selectedSeason.value : "");
    
    formData.append("description", document.getElementById("description").value);
    formData.append("githubLink", document.getElementById("githubLink").value || "");
    
    // Append the raw files
    formData.append("imageFile", imageFile);
    formData.append("modelFile", modelFile);

    // Send the multipart payload to your backend route
    const dbResponse = await fetch("http://localhost:3000/api/robots", {
      method: "POST",
      body: formData // Note: DO NOT set Content-Type header manually, the browser handles it automatically for FormData!
    });

    if (dbResponse.ok) {
      alert("🎉 Robot successfully uploaded and written to database!");
      form.reset();
      document.querySelectorAll(".drop-zone").forEach(dropZone => {
        // Reset the helper text back to original
        const textSpan = dropZone.querySelector(".drop-zone-text");
        if (textSpan) {
          if (dropZone.id === "imageDropZone") {
            textSpan.innerText = "Drop image here or click to upload";
          } else if (dropZone.id === "modelDropZone") {
            textSpan.innerText = "Drop 3D model here or click to upload";
          }
        }

        // Clear out any image or thumbnail preview divs
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
  }
});