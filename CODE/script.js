function goToDrawingPage() {
    window.location.href = "drawing.html";
}

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let tool = 'pencil';
let isDrawing = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function selectTool(selectedTool) {
    tool = selectedTool;
}

canvas.addEventListener('mousedown', function(e) {
    isDrawing = true;
    draw(e);
});

canvas.addEventListener('mousemove', function(e) {
    if (isDrawing) {
        draw(e);
    }
});

canvas.addEventListener('mouseup', function() {
    isDrawing = false;
});

function draw(e) {
    if (tool === 'pencil') {
        
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
    } else if (tool === 'eraser') {
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#fff';
    } else if (tool.startsWith('icon')) {
        // Implement code for drawing icons
        // console.log("in draw() icon");
        // let imgSrc = tool + '.png'; // Assuming icons are named like icon1.png, icon2.png, etc.
        // let img = new Image();
        // img.src = imgSrc;

        // img.onload = function() {
        //     let rect = canvas.getBoundingClientRect();
        //     let x = e.clientX - rect.left - img.width / 2; // Adjust the position to center the icon
        //     let y = e.clientY - rect.top - img.height / 2;
        //     ctx.drawImage(img, x, y);
        // };
    }

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
}

// Implement drag and drop functionality for icons
function drag(e) {
    console.log("in drag()");
    //console.log("e: " + e);

    e.dataTransfer.setData('text', e.target.id);
    //console.log("dataTransfer: " + e.dataTransfer);
    //console.log("getData: " + e.dataTransfer.getData('text'));
}

canvas.addEventListener('dragover', function(e) {
    console.log("in dragover event lis");
    e.preventDefault();
    //let data = e.target.src;
});

canvas.addEventListener('drop', function(e) {
    console.log("in drop event lis");
    e.preventDefault();
    //let data = e.dataTransfer.getData('text');
    
    //let data = e.getData(src);
    let data = "src/icon1.png"; //WORKS
    
    console.log("data " + data);
    let imgSrc = data; // Assuming data contains the image source
    let img = new Image();
    img.src = imgSrc;

    img.onload = function() {
        console.log("in img.onload");
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        ctx.drawImage(img, x, y, img.width, img.height);
    };
});