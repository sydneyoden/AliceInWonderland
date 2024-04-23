function loadCanvasBackground(imageSrc) {
    // Create a new Image object
    const image = new Image();
    image.src = imageSrc;

    // Once the image is loaded, draw it onto the canvas
    image.onload = function() {
        // Optionally, you can resize the image to fit the canvas while maintaining its aspect ratio
        const canvasAspect = canvas.width / canvas.height;
        const imageAspect = image.width / image.height;
        let drawWidth, drawHeight;

        if (imageAspect > canvasAspect) {
            // Image is wider than canvas
            drawWidth = canvas.width;
            drawHeight = canvas.width / imageAspect;
        } else {
            // Image is taller than canvas
            drawHeight = canvas.height;
            drawWidth = canvas.height * imageAspect;
        }

        // Calculate the drawing position to center the image on the canvas
        const x = (canvas.width - drawWidth) / 2;
        const y = (canvas.height - drawHeight) / 2;

        // Draw the image as the background on the canvas
        ctx.drawImage(image, x, y, drawWidth, drawHeight);
    };
}

function goToDrawingPage(event) {
    //console.log("in goToDrawingPage()");
    const buttonClass = event.target.className; // Get the class name of the button
    
    // Initialize the image source variable
    let imageSource;

    // Determine the appropriate image source based on the button's class
    if (buttonClass === 'button-home1') {
        imageSource = 'src/park.jpeg';
    } else if (buttonClass === 'button-home2') {
        imageSource = 'src/IMG_2301.png';
    } else if (buttonClass === 'button-home3') {
        imageSource = 'src/office.png';
    }
    else if (buttonClass === 'button-home4') {
        imageSource = 'src/white_bg.jpeg';
    }
    if (imageSource) {
        window.location.href = `drawing.html?bgImage=${encodeURIComponent(imageSource)}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const imageSource = urlParams.get('bgImage');

    // Check if imageSource is valid and load the background image
    if (imageSource) {
        loadCanvasBackground(imageSource);
    }
});

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let tool = 'pencil';
let isDrawing = false;
let isDragging = false;

let strokeColor = '#000';
let strokeSize = 3;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

imagePanel.style.display = 'none';

// For example, you can call the function when the document is ready or when a specific button is clicked
// document.addEventListener('DOMContentLoaded', () => {
//     const imageSource = 'src/IMG_2301.png'; // Specify the image source
//     loadCanvasBackground(imageSource);
// });

//array of images
let offsetX, offsetY;
let images = []; // Array to store images

// Load images
// let imgSources = ['src/icon1.png', 'src/icon2.png', 'src/icon3.png', 'src/icon4.png'];
// imgSources.forEach(src => {
//     let img = new Image();
//     img.onload = function() {
//         images.push({ element: img, x: 0, y: 0, width: img.width, height: img.height });
//         redrawCanvas();
//     };
//     img.src = src;
// });

function goToIndexPage() {
    // Navigate back to index.html
    window.location.href = 'index.html';
}

function selectTool(selectedTool) {
    tool = selectedTool;
}

canvas.addEventListener('mousedown', function(e) {
    console.log("mouseDown");
    if (tool === 'pencil' || tool === 'eraser') {
        startDrawing(e);
        //isDrawing = true;
        //draw(e);
    } else if (tool === 'move') {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if the click is on any image
        for (let i = images.length - 1; i >= 0; i--) {
            const img = images[i];
            if (x > img.x && x < img.x + img.width && y > img.y && y < img.y + img.height) {
                isDragging = true;
                offsetX = x - img.x;
                offsetY = y - img.y;
                // Move the selected image to the end of the array so that it appears on top
                images.splice(i, 1);
                images.push(img);
                break;
            }
        }
    }
    
});

canvas.addEventListener('mousemove', function(e) {
    //console.log("mouseMove");
    if (isDrawing) {
        draw(e);
    }

    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - offsetX;
        const y = e.clientY - rect.top - offsetY;
        const img = images[images.length - 1]; // Get the last image (the one being dragged)
        img.x = x;
        img.y = y;
        redrawCanvas();
    }
});

canvas.addEventListener('mouseup', function(e) {
    //console.log("mouseUp");
    if (tool === 'pencil' || tool === 'eraser') {
        stopDrawing(e);
        //isDrawing = false;
    } else if (tool == 'move') {
        isDragging = false;
        stopDrawing(e);
    }
});

canvas.addEventListener('mouseleave', function(e) {
    //console.log("mouseLeave");
    if (tool === 'pencil' || tool === 'eraser') {
        stopDrawing(e);
        //isDrawing = false;
    } else if (tool == 'move') {
        //isDragging = false;
        //stopDrawing(e);
    }
});

function startDrawing (e) {
    //console.log("startDrawing");
    isDrawing = true;
    ctx.beginPath();
    draw(e);
    ctx.beginPath();
}

function stopDrawing (e) {
    //console.log("stopDrawing");
    if (isDrawing === true) {
        isDrawing = false;
        //ctx.endPath();
        //this.saveState();
    }
}

function draw(e) {
    //console.log("draw");
    if (!isDrawing) return
    if (tool === 'pencil') {
        ctx.lineWidth = strokeSize; //ctx.lineWidth = strokeSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = strokeColor; //ctx.strokeStyle = strokeColor;
    } else if (tool === 'eraser') {
        ctx.lineWidth = 10; //ctx.lineWidth = strokeSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#d1c1da'; //ctx.strokeStyle = canvasColor;
    }
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

// Implement drag and drop functionality for images
function drag(e) {
    //console.log("in drag()");
    //console.log("e: " + e);

    e.dataTransfer.setData('text', e.target.src);
    //console.log("dataTransfer: " + e.dataTransfer);
    //console.log("getData: " + e.dataTransfer.getData('text'));
}

canvas.addEventListener('dragover', function(e) {
    //console.log("in dragover event lis");
    e.preventDefault();
    //let data = e.target.src;
});

canvas.addEventListener('drop', function(e) {
    //console.log("in drop event lis");
    e.preventDefault();
    let data = e.dataTransfer.getData('text'); //final
    
    //let data = "src/gif1.gif"; //WORKS
    
    console.log("data " + data);
    let imgSrc = data; // Assuming data contains the image source
    let img = new Image();
    img.src = imgSrc;

    img.onload = function() {
        // Calculate the drop location relative to the canvas
        let rect = canvas.getBoundingClientRect();
        let dropX = e.clientX - rect.left;
        let dropY = e.clientY - rect.top;

        // Calculate the top-left corner position of the image so its center aligns with the drop location
        let imgCenterX = img.width / 2;
        let imgCenterY = img.height / 2;
        let x = dropX - imgCenterX;
        let y = dropY - imgCenterY;

        // Draw the image on the canvas at the calculated position
        ctx.drawImage(img, x, y, img.width, img.height);

        // Optionally, you can add the image object to the images array for managing its position later
        images.push({
            element: img,
            x: x,
            y: y,
            width: img.width,
            height: img.height
        });
    };
});

function openImagePanel() {
    const imagePanel = document.getElementById('imagePanel');
    if (imagePanel.style.display === 'none') {
        imagePanel.style.display = 'block';
        //console.log("==none");
    } else {
        imagePanel.style.display = 'none';
        console.log("closing");
    }
}




function toggleDropdown() {
    var dropdown = document.getElementById("pencilDropdown");
    dropdown.classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}


function updateStorkeColor() {
    strokeColor = document.getElementById('colorPicker').value;
}

function updateStrokeSize() {
    strokeSize = document.getElementById('thicknessPicker').value;
}