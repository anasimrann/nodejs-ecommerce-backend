const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dp81srnqb",
  api_key: "896263196672625",
  api_secret: "1oeubVmGGms3Wfuc0mK_D1TZf2w",
});

const uploads = async (filePath) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
  return await cloudinary.uploader.upload(filePath, options);
};
module.exports = { uploads };
