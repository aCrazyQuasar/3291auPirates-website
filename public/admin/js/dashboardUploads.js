// app.js
import { genUploader } from "uploadthing/client";

// 1. Initialize the UploadThing client helper pointing to your Express backend route
const uploadFiles = genUploader({
  url: "http://localhost:3000/api/uploadthing",
});

const form = document.getElementById("robotForm");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Stop normal form reload
  
  submitBtn.disabled = true;
  submitBtn.innerText = "Uploading files to cloud...";

  // Get files from the DOM
  const imageFileInput = document.getElementById("imageFile");
  const modelFileInput = document.getElementById("modelFile");

  const imageFile = imageFileInput.files[0];
  const modelFile = modelFileInput.files[0];

  try {
    // 2. Upload the files to UploadThing
    // 'robotAssetUploader' matches the exact configuration key on your backend!
    const uploadResponse = await uploadFiles("robotAssetUploader", {
      files: [imageFile, modelFile],
    });

    console.log("Cloud Upload response:", uploadResponse);

    // Find which returned item is the image and which is the 3D model
    const imgData = uploadResponse.find(f => f.name.endsWith('.png'));
    const glbData = uploadResponse.find(f => f.name.endsWith('.glb'));

    submitBtn.innerText = "Saving robot details to database...";

    // 3. Prepare the final payload for your Express/Prisma route
    const robotData = {
      name: document.getElementById("name").value,
      year: document.getElementById("year").value,
      season: document.getElementById("season").value,
      description: document.getElementById("description").value,
      githubLink: document.getElementById("githubLink").value || undefined,
      // Map data directly to match what your req.body expects in Express
      image: imgData.url,
      imageKey: imgData.key,
      model: glbData.url,
      modelKey: glbData.key
    };

    // 4. Send everything to your /api/robots endpoint
    const response = await fetch("http://localhost:3000/api/robots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(robotData),
    });

    if (response.ok) {
      alert("Robot successfully added to the database!");
      form.reset();
    } else {
      const errData = await response.json();
      alert(`Database error: ${errData.error}`);
    }

  } catch (error) {
    console.error(error);
    alert("An error occurred during file upload or database save.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = "Save Robot Display";
  }
});