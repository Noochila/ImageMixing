const Jimp = require('jimp');

async function mergeImagesRowWise(image1Path, image2Path, outputPath) {
    try {
        // Read the input images using Jimp
        const image1 = await Jimp.read(image1Path);
        const image2 = await Jimp.read(image2Path);

        // Calculate the width of the resulting image (choose the wider image)
        const maxWidth = Math.max(image1.getWidth(), image2.getWidth());

        // Calculate the total height of the resulting image
        const totalHeight = image1.getHeight() + image2.getHeight();

        // Create a new Jimp image with the combined dimensions and a white background
        const combinedImage = new Jimp(maxWidth, totalHeight, 0xffffffff);

        let y = 0; // Initialize the y-coordinate

        // Merge the images row by row
        for (let row = 0; row < totalHeight; row++) {
            const currentImage = row % 2 === 0 ? image1 : image2; // Alternate between images
            const currentRow = row % 2 === 0 ? row / 2 : (row - 1) / 2; // Adjust row number

            // Copy the current row from the current image to the combined image
            for (let x = 0; x < maxWidth; x++) {
                const pixelColor = currentImage.getPixelColor(x, currentRow);
                combinedImage.setPixelColor(pixelColor, x, y);
            }

            y++; // Move to the next row in the combined image
        }

        // Save the resulting image
        await combinedImage.writeAsync(outputPath);

        console.log('Images merged row by row successfully');
    } catch (error) {
        console.error(error);
    }
}

// Example usage:
mergeImagesRowWise('./1.bmp', './2.bmp', 'combined_rowwise4.bmp');