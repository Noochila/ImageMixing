
// require('dotenv').config()
// const express = require('express');
// const multer = require('multer');
// const Jimp = require('jimp');
// const path = require('path');
// const fs = require('fs');
// const admin = require('firebase-admin');

// const app = express();
// const port = 3000;

// // Initialize Firebase Admin SDK with your service account key JSON
// const serviceAccount = require('./firebase.json'); // Replace with your service account key JSON file

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     storageBucket: 'gs://th-sem-el.appspot.com', // Replace with your Firebase Storage bucket URL
// });

// // Set up file storage using multer
// const storage = multer.diskStorage({
//     destination: './uploads',
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     },
// });

// const upload = multer({ storage });

// app.use(express.static('public'));// ... (previous code)

// app.post('/merge', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), async (req, res) => {
//     try {
//         const { image1, image2 } = req.files;

//         // Read the input images using Jimp
//         const jimpImage1 = await Jimp.read(image1[0].path);
//         const jimpImage2 = await Jimp.read(image2[0].path);

//         // Check if the dimensions are equal
//         if (jimpImage1.getWidth() !== jimpImage2.getWidth() || jimpImage1.getHeight() !== jimpImage2.getHeight()) {
//             // Images have different dimensions, send an error response
//             return res.status(400).send('Uploaded images must have the same dimensions.');
//         }

//         // Calculate the width and height of the resulting image
//         const maxWidth = Math.max(jimpImage1.getWidth(), jimpImage2.getWidth());
//         const totalHeight = jimpImage1.getHeight() + jimpImage2.getHeight();

//         // Create a new Jimp image with the combined dimensions and a white background
//         const combinedImage = new Jimp(maxWidth, totalHeight, 0xffffffff);

//         // Merge the images row by row
//         for (let row = 0; row < totalHeight; row++) {
//             const currentImage = row % 2 === 0 ? jimpImage1 : jimpImage2; // Alternate between images
//             const currentRow = row % 2 === 0 ? row / 2 : (row - 1) / 2; // Adjust row number

//             // Copy the current row from the current image to the combined image
//             for (let x = 0; x < maxWidth; x++) {
//                 const pixelColor = currentImage.getPixelColor(x, currentRow);
//                 combinedImage.setPixelColor(pixelColor, x, row);
//             }
//         }

//         // Generate a unique filename for the merged image
//         const storagePath = `merged_images/${Date.now()}.bmp`;

//         // Upload the merged image to Firebase Storage directly from memory buffer
//         const combinedImageBuffer = await combinedImage.getBufferAsync(Jimp.MIME_BMP);
//         const bucket = admin.storage().bucket(); // Get a reference to your Firebase Storage bucket

//         const file = bucket.file(storagePath);
//         await file.save(combinedImageBuffer, {
//             metadata: {
//                 contentType: 'image/bmp', // Set the content type
//             },
//         });

//         // Generate a signed URL for the file
//         const [url] = await file.getSignedUrl({
//             action: 'read',
//             expires: Date.now() + 1000 * 60 * 60, // 1-hour expiration
//             responseDisposition: 'attachment', // This sets the content-disposition header to force a download
//         });
        
//         // Send a success response with a dynamic download button
//         res.status(200).send(`
//             <h1>Merged image uploaded to Firebase Storage.</h1>
//             <a href="${url}" download="merged_image.bmp">
//                 <button>Download Merged Image</button>
//             </a>
//         `);

//         // Optionally, delete the uploaded images
//         fs.unlinkSync(image1[0].path);
//         fs.unlinkSync(image2[0].path);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('An error occurred while merging and uploading images.');
//     }
// });

// // ... (rest of your code)


// app.listen(port,() => {
//     console.log(`Server is running on port ${port}`);
// });
require('dotenv').config()
const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const app = express();
// const port = 3000;

// Set up file storage using multer
const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

app.use(express.static('public'));
app.use('/merged_images', express.static(path.join(__dirname, 'public', 'merged_images')));

app.post('/merge', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), async (req, res) => {
    try {
        const { image1, image2 } = req.files;

        // Read the input images using Jimp
        const jimpImage1 = await Jimp.read(image1[0].path);
        const jimpImage2 = await Jimp.read(image2[0].path);

        // Check if the dimensions are equal
        if (jimpImage1.getWidth() !== jimpImage2.getWidth() || jimpImage1.getHeight() !== jimpImage2.getHeight()) {
            // Images have different dimensions, send an error response
            return res.status(400).send('Uploaded images must have the same dimensions.');
        }

        // Calculate the width and height of the resulting image
        const maxWidth = Math.max(jimpImage1.getWidth(), jimpImage2.getWidth());
        const totalHeight = jimpImage1.getHeight() + jimpImage2.getHeight();

        // Create a new Jimp image with the combined dimensions and a white background
        const combinedImage = new Jimp(maxWidth, totalHeight, 0xffffffff);

        // Merge the images row by row
        for (let row = 0; row < totalHeight; row++) {
            const currentImage = row % 2 === 0 ? jimpImage1 : jimpImage2; // Alternate between images
            const currentRow = row % 2 === 0 ? row / 2 : (row - 1) / 2; // Adjust row number

            // Copy the current row from the current image to the combined image
            for (let x = 0; x < maxWidth; x++) {
                const pixelColor = currentImage.getPixelColor(x, currentRow);
                combinedImage.setPixelColor(pixelColor, x, row);
            }
        }

        // Generate a unique filename for the merged image
        const filename = `${Date.now()}.bmp`;
        const localPath = path.join(__dirname, 'public', 'merged_images', filename);

        // Save the merged image to a local directory
        await combinedImage.writeAsync(localPath);

        // Generate the URL for the merged image
        const url = `http://${req.headers.host}/merged_images/${filename}`;

        // Send a success response with a dynamic download button
        res.status(200).send(`
            <h1>Merged image created.</h1>
            <a href="${url}" download="merged_image.bmp">
                <button>Download Merged Image</button>
            </a>
        `);

        // Optionally, delete the uploaded images
        fs.unlinkSync(image1[0].path);
        fs.unlinkSync(image2[0].path);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while merging and uploading images.');
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});