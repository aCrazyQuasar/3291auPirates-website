// uploadthing.js
import { createUploadthing } from "uploadthing/express";

const f = createUploadthing();

export const uploadRouter = {
  robotAssetUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    blob: { maxFileSize: "32MB", maxFileCount: 1 } // for .glb models
  })
  .onUploadComplete(async ({ file }) => {
    console.log("File uploaded successfully:", file.url);
    return { url: file.url, key: file.key };
  }),
};