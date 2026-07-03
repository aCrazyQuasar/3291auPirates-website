// uploadthing.js
const { createUploadthing } = require("uploadthing/express");
const f = createUploadthing();

const uploadRouter = {
  // A single endpoint config that accepts 1 image and 1 generic 3D file/blob
  robotAssetUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    blob: { maxFileSize: "32MB", maxFileCount: 1 } // .glb files are binary blobs
  })
  .onUploadComplete(async ({ file }) => {
    // We just return this so the frontend receives it
    console.log("File uploaded to cloud successfully:", file.url);
    return { url: file.url, key: file.key };
  }),
};

module.exports = { uploadRouter };