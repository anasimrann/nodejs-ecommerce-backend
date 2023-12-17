const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const { exec } = require("child_process");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./train");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/model", upload.single("file"), (req, res) => {
  const img_path = req.file?.path;
  if (img_path) {
    exec(`python finalpipeline.py ${path.resolve(img_path)}`, (err, stdout, stderr) => {
        const response = stdout;
        res.send(response);
      });
    } else {
      res.send("Please provide the file path");
    }
  }
//   if (uploadFileAbsolutePath) {
//     exec(`python finalpipeline.py ${path}`, (err, stdout, stderr) => {
//       const response = stdout;
//       res.send(response);
//     });
//   } else {
//     res.send("Please provide the file path");
//   }
// }
);

module.exports = router;
