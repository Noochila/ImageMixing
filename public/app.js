// document.addEventListener("DOMContentLoaded", function () {
//     const image1Input = document.querySelector('input[name="image1"]');
//     const image2Input = document.querySelector('input[name="image2"]');
//     const image1Preview = document.getElementById("image1");
//     const image2Preview = document.getElementById("image2");
//     const mergedImage = document.getElementById("mergedImage");
//     const uploadStatus = document.getElementById("uploadStatus");

//     // Load the merged image if it exists
//     loadMergedImage();

//     image1Input.addEventListener("change", handleImageUpload);
//     image2Input.addEventListener("change", handleImageUpload);

//     function handleImageUpload() {
//         const image1File = image1Input.files[0];
//         const image2File = image2Input.files[0];

//         if (image1File) {
//             displayImage(image1File, image1Preview);
//         }

//         if (image2File) {
//             displayImage(image2File, image2Preview);
//         }

//         if (image1File && image2File) {
//             mergeImages(image1File, image2File);
//         }
//     }

//     function displayImage(file, previewElement) {
//         const reader = new FileReader();

//         reader.onload = function (e) {
//             previewElement.src = e.target.result;
//         };

//         reader.readAsDataURL(file);
//     }

//     function mergeImages(image1File, image2File) {
//         const formData = new FormData();
//         formData.append("image1", image1File);
//         formData.append("image2", image2File);

//         fetch('/merge', {
//             method: 'POST',
//             body: formData,
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 uploadStatus.textContent = data.message;
//                 mergedImage.src = data.mergedImageUrl;

//                 // Reload the merged image
//                 loadMergedImage();
//             } else {
//                 uploadStatus.textContent = data.message;
//             }
//         })
//         .catch(error => {
//             console.error(error);
//             uploadStatus.textContent = 'An error occurred while merging and uploading images.';
//         });
//     }

//     function loadMergedImage() {
//         // Load the merged image from the server
//         fetch('/getMergedImage')
//         .then(response => response.json())
//         .then(data => {
//             if (data.success && data.mergedImageUrl) {
//                 mergedImage.src = data.mergedImageUrl;
//             }
//         })
//         .catch(error => {
//             console.error(error);
//         });
//     }
// });
document.addEventListener("DOMContentLoaded", function () {
    const image1Input = document.querySelector('input[name="image1"]');
    const image2Input = document.querySelector('input[name="image2"]');
    const image1Preview = document.getElementById("image1");
    const image2Preview = document.getElementById("image2");
    const mergedImage = document.getElementById("mergedImage");
    const uploadStatus = document.getElementById("uploadStatus");

    // Load the merged image if it exists
    loadMergedImage();

    image1Input.addEventListener("change", handleImageUpload);
    image2Input.addEventListener("change", handleImageUpload);

    function handleImageUpload() {
        const image1File = image1Input.files[0];
        const image2File = image2Input.files[0];

        if (image1File) {
            displayImage(image1File, image1Preview);
        }

        if (image2File) {
            displayImage(image2File, image2Preview);
        }

        if (image1File && image2File) {
            mergeImages(image1File, image2File);
        }
    }

    function displayImage(file, previewElement) {
        const reader = new FileReader();

        reader.onload = function (e) {
            previewElement.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }

    function mergeImages(image1File, image2File) {
        const formData = new FormData();
        formData.append("image1", image1File);
        formData.append("image2", image2File);

        fetch('/merge', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                uploadStatus.textContent = data.message;
                mergedImage.src = data.mergedImageUrl; // Set the src attribute of the mergedImage element to the URL of the uploaded image
            } else {
                uploadStatus.textContent = data.message;
            }
        })
        .catch(error => {
            console.error(error);
            uploadStatus.textContent = 'An error occurred while merging and uploading images.';
        });
    }

    function loadMergedImage() {
        // Load the merged image from the server
        fetch('/getMergedImage')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.mergedImageUrl) {
                mergedImage.src = data.mergedImageUrl;
            }
        })
        .catch(error => {
            console.error(error);
        });
    }
});
