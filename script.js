var drawingData = null;

// loads image into canvas
function loadCanvasBackground(imageSrc) {
    const image = new Image();
    image.src = imageSrc;
    image.onload = function() {
        const canvasAspect = canvas.width / canvas.height;
        const imageAspect = image.width / image.height;
        let drawWidth, drawHeight;
        if (imageAspect > canvasAspect) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imageAspect;
        } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imageAspect;
        }
        const x = (canvas.width - drawWidth) / 2;
        const y = (canvas.height - drawHeight) / 2;
        ctx.drawImage(image, x, y, drawWidth, drawHeight);
    };
}

// function that opens drawing page
function goToDrawingPage(event) {
    const buttonClass = event.target.className;
    let imageSource;
    if (buttonClass === 'button-home1') {
        imageSource = 'src/park.png';
    } else if (buttonClass === 'button-home2') {
        imageSource = 'src/IMG_2301.png';
    } else if (buttonClass === 'button-home3') {
        imageSource = 'src/office.png';
    }
    else if (buttonClass === 'button-home4') {
        imageSource = 'src/transparent_bg.png';
    }
    if (imageSource) {
        if (buttonClass === 'button-home4'){
            window.location.href = `stickerMaker.html?bgImage=${encodeURIComponent(imageSource)}`;
        }else {
            window.location.href = `drawing.html?bgImage=${encodeURIComponent(imageSource)}`;
        }
    }
}

// event listener for canvas loading
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const imageSource = urlParams.get('bgImage');
    if (imageSource) {
        loadCanvasBackground(imageSource);
        loadStickerFromLocalStorage();
    }
});

// important variables
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let tool = 'pencil';
let isDrawing = false;
let isDragging = false;
let strokeColor = '#000';
let strokeSize = 5;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
imagePanel.style.display = 'none';
let offsetX, offsetY;
let images = [];

// function that opens main menu
function goToIndexPage() {
    window.location.href = 'index.html';
}

// function that selects button
function selectTool(selectedTool) {
    tool = selectedTool;
}

// event listener for pressing down on the mouse
canvas.addEventListener('mousedown', function(e) {
    if (tool === 'pencil' || tool === 'eraser') {
        startDrawing(e);
    } else if (tool === 'move') {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        for (let i = images.length - 1; i >= 0; i--) {
            const img = images[i];
            if (x > img.x && x < img.x + img.width && y > img.y && y < img.y + img.height) {
                isDragging = true;
                offsetX = x - img.x;
                offsetY = y - img.y;
                images.splice(i, 1);
                images.push(img);
                break;
            }
        }
    }
});

// event listener for moving the mouse
// drawing and dragging
canvas.addEventListener('mousemove', function(e) {
    if (isDrawing) {
        draw(e);
    }
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - offsetX;
        const y = e.clientY - rect.top - offsetY;
        const img = images[images.length - 1];
        img.x = x;
        img.y = y;
        redrawCanvas();
    }
});

// event listener for moving the mouse up
canvas.addEventListener('mouseup', function(e) {
    if (tool === 'pencil' || tool === 'eraser') {
        stopDrawing(e);
        setTimeout(function() {
            drawingData = canvas.toDataURL("image/png");
        }, 100);
    } else if (tool == 'move') {
        isDragging = false;
        stopDrawing(e);
    }
});

// event listener for stopping mouse movement
canvas.addEventListener('mouseleave', function(e) {
    if (tool === 'pencil' || tool === 'eraser') {
        stopDrawing(e);
    } else if (tool == 'move') {
    }
});

// function for starting to draw
function startDrawing (e) {
    isDrawing = true;
    ctx.beginPath();
    draw(e);
    ctx.beginPath();
}

// function for stopping drawing
function stopDrawing (e) {
    if (isDrawing === true) {
        isDrawing = false;
    }
}

// function for what happens during the draw phase
function draw(e) {
    if (!isDrawing) return
    if (tool === 'pencil') {
        ctx.lineWidth = strokeSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = strokeColor;
    } else if (tool === 'eraser') {
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#d1c1da';
    }
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

// function for dragging images
function drag(e) {
    e.dataTransfer.setData('text', e.target.src);
}

// event listener for dragging an image
canvas.addEventListener('dragover', function(e) {
    e.preventDefault();
});

// event listener for dropping an image
canvas.addEventListener('drop', function(e) {
    e.preventDefault();
    let data = e.dataTransfer.getData('text');
    let imgSrc = data;
    let img = new Image();
    img.src = imgSrc;
    img.onload = function() {
        let rect = canvas.getBoundingClientRect();
        let dropX = e.clientX - rect.left;
        let dropY = e.clientY - rect.top;
        let imgCenterX = img.width / 2;
        let imgCenterY = img.height / 2;
        let x = dropX - imgCenterX;
        let y = dropY - imgCenterY;
        ctx.drawImage(img, x, y, img.width, img.height);
        images.push({
            element: img,
            x: x,
            y: y,
            width: img.width,
            height: img.height
        });
    };
});

// function opening the sticker/image panel
function openImagePanel() {
    const imagePanel = document.getElementById('imagePanel');
    if (imagePanel.style.display === 'none') {
        imagePanel.style.display = 'block';
    } else {
        imagePanel.style.display = 'none';
    }
}

// function that saves daydream as an image
function saveCanvasAsImage() {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = "Your_Day_Dream";
    link.click();
}

// event listener for clicking to save
document.getElementById('saveButton').addEventListener('click', saveCanvasAsImage);

// function toggling the dropdown sticker/image panel
function toggleDropdown() {
    var dropdown = document.getElementById("pencilDropdown");
    dropdown.classList.toggle("show");
    if (pencilDropdown.style.display === 'none') {
        pencilDropdown.style.display = 'block';
    } else {
        pencilDropdown.style.display = 'none';
    }
    
}

// Closes dropdown if the user clicks outside of it
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

// function that updates pencil color
function updateStorkeColor() {
    strokeColor = document.getElementById('colorPicker').value;
}

// function that updates pencil size
function updateStrokeSize() {
    strokeSize = document.getElementById('thicknessPicker').value;
}

// function for making a sticker
function useAsSticker() {
    var sticker = new Image();
    sticker.src = drawingData;
    sticker.width = 100;
    sticker.height = 100;
    sticker.draggable = true;
    sticker.addEventListener('dragstart', drag);
    document.getElementById("imagePanel").appendChild(sticker);
    storeStickerInLocalStorage(sticker.src);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const urlParams = new URLSearchParams(window.location.search);
    const imageSource = urlParams.get('bgImage');
    if (imageSource) {
        loadCanvasBackground(imageSource);
    }
    drawingData = null;
}

// function to store sticker data in Local Storage
function storeStickerInLocalStorage(stickerDataURL) {
    localStorage.setItem('sticker', stickerDataURL);
}

// function to retrieve sticker data from Local Storage
function getStickerFromLocalStorage() {
    return localStorage.getItem('sticker');
}

// function to load the stored sticker onto the canvas
function loadStickerFromLocalStorage() {
    const stickerDataURL = getStickerFromLocalStorage();
    if (stickerDataURL) {
        var sticker = new Image();
        sticker.onload = function() {
            ctx.drawImage(sticker, 0, 0, sticker.width, sticker.height);
        };
        sticker.src = stickerDataURL;
        sticker.width = 100;
        sticker.height = 100;
        sticker.draggable = true;
        sticker.addEventListener('dragstart', drag);
        document.getElementById("imagePanel").appendChild(sticker);
    }
}

// function that clears sticker from canvas
function clearStickerFromLocalStorage() {
    localStorage.removeItem('sticker');
}
