const express = require('express');
const multer = require('multer');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const router = express.Router();

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Load TFLite model
let tfliteModel;
async function loadModel() {
    const modelPath = path.join(__dirname, '../models/face_detection_model.tflite');
    tfliteModel = await tf.loadGraphModel(tf.io.fileSystem(modelPath));
}

loadModel();

// Route to handle video upload and process
router.post('/', upload.single('video'), async (req, res) => {
    try {
        const videoPath = req.file.path;
        const frames = await extractFramesFromVideo(videoPath);

        const attendanceResults = [];
        for (const frame of frames) {
            const inputTensor = tf.node.decodeImage(frame, 3)
                .resizeNearestNeighbor([128, 128])
                .toFloat()
                .expandDims();
            const prediction = tfliteModel.predict(inputTensor);
            const predictionValue = (await prediction.data())[0];

            attendanceResults.push(predictionValue > 0.5 ? 'Present' : 'Absent');
        }

        res.json({ status: 'success', attendance: attendanceResults });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        fs.unlinkSync(req.file.path); // Cleanup uploaded video
    }
});

// Extract frames from video using ffmpeg
async function extractFramesFromVideo(videoPath) {
    return new Promise((resolve, reject) => {
        const frames = [];
        ffmpeg(videoPath)
            .on('end', () => {
                resolve(frames);
            })
            .on('error', (err) => {
                reject(err);
            })
            .screenshots({
                count: 5,
                folder: 'uploads/',
                filename: 'frame-%i.png',
                size: '320x240'
            })
            .on('filenames', (filenames) => {
                filenames.forEach((filename) => {
                    const filePath = path.join(__dirname, '../uploads/', filename);
                    const base64Image = fs.readFileSync(filePath, 'base64');
                    frames.push(Buffer.from(base64Image, 'base64'));
                    fs.unlinkSync(filePath); // Cleanup frame file
                });
            });
    });
}

module.exports = router;
