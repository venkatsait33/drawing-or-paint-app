const canvas = document.querySelector("canvas"),

toolBtns = document.querySelectorAll(".tool"),

fillColor = document.querySelector("#fill-color"),

sizeSlider = document.querySelector("#size-slider"),

colorBtns = document.querySelectorAll(".colors .option "),

colorPicker = document.querySelector(".color-picker"),

clearCanvas = document.querySelector(".clear-canvas"),

saveImg = document.querySelector(".save-img")


ctx = canvas.getContext("2d");

// global values with default value
let prevMouseX, prevMouseY, snapshot
isDrawing = false;
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

const setCanvasBackground = () => {
    // setting whole canvas background to white, so the download img background will be white
    ctx.fillStyle ="#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; 
    // setting fillstyle back to the selected color, it will be the brush color
    
}

window.addEventListener("load", () => {
// setting canvas width/hheight .. offsetwidth/height returns
// viewable width/height of an element

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
})

const drawSeq = (e) => {
    // if fillcolor isn't checked draw a square with border else draw rect with background
    if (!fillColor.checked) {  
        // creating circle according to the mouse pointer
    return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) =>{
    ctx.beginPath(); // creating new path to draw circle
    // getting radious for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX),2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked? ctx.fill() :ctx.stroke(); // if fillcolor is checked fill color else draw border circle
}


const drawTriangle = (e) => {
    ctx.beginPath(); // creating new path to draw Triangle
    ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);// creating bottom line of triangle
    ctx.closePath(); //closing path of a trianle so the third line draw automatically
    fillColor.checked ? ctx.fill() :ctx.stroke(); // if fillcolor is checked fill triangle else draw border triangle
}

const startDraw=(e) =>{
    isDrawing = true;
    prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY;  // passing current mouseY position as prevMouseY value
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; // passing brushsize as line width
    ctx.strokeStyle = selectedColor; // passing selected color as stroke style
    ctx.fillStyle = selectedColor;// passing selected color as fill color
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
    // copying canvas data & passing  as snapshot value .. this aviod dragging the image
}

const drawing = (e) =>{
    if(!isDrawing) return; // if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); //adding copied canvas data on to this canvas 

    if(selectedTool === "brush" || selectedTool === "eraser"){
        // if selected tool is eraser then set strokestyle to white
        // to paint white color on to the exisiting cancas content else set stroke color to selected color
        ctx.strokeStyle = selectedTool ==="eraser" ? "#fff" : selectedColor;
     ctx.lineTo(e.offsetX, e.offsetY); 
    // creating line according to the mouse pointer
    ctx.stroke();
    // drawing/filling line with color
    }else if(selectedTool === "square") {
        drawSeq(e);
    }else if(selectedTool === "circle") {
        drawCircle(e);
    }else {
         drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option
        // removing active class from  the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(btn.id)


    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // passing slider value as brush size

colorBtns.forEach(btn => {

    btn.addEventListener("click", () => {
           // removing active class from  the previous option and adding on current clicked option
           document.querySelector(".options .selected").classList.remove("selected");
           btn.classList.add("selected");
           //passing selected btn background color as selected color value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");


    })
});

/*colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});*/

clearCanvas.addEventListener("click", ()=> {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

saveImg.addEventListener("click", ()=> {
   const link = document.createElement("a"); // creating <a> element
   link.download = `${Date.now()}.jpg`; // passing cureent data as link href value
   link.href = canvas.toDataURL(); // passing canvasdata as link href value
   link.click(); // clicking link to download image
});

canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", () => isDrawing = false);
 // it will start from the end point of strike 
 // for new strike we use begainpath 
