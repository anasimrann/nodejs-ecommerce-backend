const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dp81srnqb",
  api_key: "896263196672625",
  api_secret: "1oeubVmGGms3Wfuc0mK_D1TZf2w"
})

const uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (err, result) => {
            if (err) {
                console.log(err, "sdsds")
            }
            resolve({
                url: result.url,
                id: result.public_id
            })
        }, {
            resource_type: "auto",
            folder: folder
        })

    })
}
module.exports = {uploads}