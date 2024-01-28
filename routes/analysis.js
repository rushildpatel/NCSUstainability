var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
const { exec } = require("child_process");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Include the fs module
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

router.get("/", middleware.isLoggedIn, function (req, res) {
  // Replace 'your_python_script.py' with the actual name of your Python script
  res.render("analysis/index");
});

router.get("/tuffys", middleware.isLoggedIn, function (req, res) {
  res.render("analysis/tuffys");
});

router.get("/diningHall",middleware.isLoggedIn, function (req, res) {
  res.render("analysis/diningHall");
});

router.post("/tuffys/upload_xlsx", middleware.isLoggedIn, upload.single("excelFile"), function (req, res) {
  console.log("hello");
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const fileBuffer = req.file.buffer;
  // console.log(fileBuffer.toString());
  const fileName = req.file.originalname;
  //   console.log(fileName);

  const uploadDir = path.join(process.env.BASE_DIR, "data");
  console.log(uploadDir);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const filePath = uploadDir + "/" + "tuffy_data.xlsx";
  fs.writeFile(filePath, fileBuffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error saving the file.");
    }

    console.log("File saved successfully:", filePath);

    //   Execute the Python script
    const pythonScript = process.env.BASE_DIR + "/analysis/Tuffy/analysis.py";
    exec(`python ${pythonScript}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return;
      }
      console.log(`Python script output:\n${stdout}`);
      res.status(200);
      // res.send("File uploaded and saved successfully!");
      res.render("analysis/graph_tuffy");
    });
  });
});

router.post("/diningHall/upload_csv", middleware.isLoggedIn, upload.single("csvFile"), function (req, res) {
  console.log("hello");

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const fileBuffer = req.file.buffer;
  // console.log(fileBuffer.toString());
  const fileName = req.file.originalname;
  // console.log(fileName);

  const uploadDir = path.join(process.env.BASE_DIR, "data");
  console.log(uploadDir);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const filePath = uploadDir + "/" + "clark_data.csv";
  fs.writeFile(filePath, fileBuffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error saving the file.");
    }

    console.log("File saved successfully:", filePath);
    //   Execute the Python script
    const pythonScript = process.env.BASE_DIR + "/analysis/Clark/analysis.py";
    exec(`python ${pythonScript}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return;
      }
      console.log(`Python script output:\n${stdout}`);
    });

    res.status(200);
    // res.send("File uploaded and saved successfully!");
    res.render("analysis/graph_clark");
  });
});

module.exports = router;
