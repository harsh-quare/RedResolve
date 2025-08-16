const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const fileUploadCloudinary = async (localFilePath, folder) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Automatically detect file type (image, video, etc.)
      folder: folder, // Folder name in Cloudinary
    });

    // File has been uploaded successfully, now remove the temporary local file
    fs.unlinkSync(localFilePath);

    return response.secure_url;
  } catch (error) {
    // Remove the locally saved temporary file as the upload operation failed
    fs.unlinkSync(localFilePath); 
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};

module.exports = fileUploadCloudinary;