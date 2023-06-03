const mainBody = document.getElementById('main-body');
const canvas = document.getElementById("theCanvas");
const context = canvas.getContext('2d');
const eraser = document.getElementById('eraser');
const eraserSelector = document.getElementById('select-eraser');
const pencilSelector = document.getElementById('select-pencil');
const lineSelector = document.getElementById('select-line');
const rectSelector = document.getElementById('select-rectangle');
const diamondSelector = document.getElementById('select-diamond');
const ellipseSelector = document.getElementById('select-ellipse');
const strokeSelector = document.getElementById('select-stroke');
const selector = document.getElementById('selector');
const textSelector = document.getElementById('select-text');
const colorPicker = document.getElementById('color-picker');
const opacitySelector = document.getElementById('opacity');
const tools = document.getElementById('tools');
const typeSelector = document.getElementById('type-selector');
const buttons = document.getElementsByClassName('tool-button');
const tempRect = document.getElementById('temp-rect');
const tempEllipse = document.getElementById('temp-ellipse');
const tempLine = document.getElementById('temp-line');
const tempText = document.getElementById('temp-text');
const clear = document.getElementById('clear');
const exception = document.getElementById('exception');
const toolButtons = document.getElementsByClassName('tool-button')

function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
};

if (detectMob()) {
	mainBody.style.display = 'none';
	exception.style.display = 'block';
}
else {
	mainBody.style.display = 'block';
	exception.style.display = 'none';
}

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
})

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
 
strokeSelector.value = 1;

let penStyle = 'pencil';
let activeButton = pencilSelector;
activeButton.style.color = '#0075ff'

var strokeWidth = strokeSelector.value;
var color = colorPicker.value;
var opacity = opacitySelector.value;
var font;

var eraserDimension = 15;

var startX;
var startY;
var endX;
var endY;
var textValue;
var tempX;
var tempY; 
var tempHeight;
var tempWidth;

var mouseClicked = false;
var toolMovable = false;
var writing = false;



const strokeToggle = () => {
	if (typeSelector.value == 'fill' && penStyle != 'line' && penStyle != 'eraser' && penStyle != 'text') {
		strokeSelector.disabled = true;
		strokeSelector.style.cursor = 'not-allowed';
		strokeSelector.style.color = '#959393';
		strokeSelector.value = 1;
		strokeWidth = 1;
	}

	else {
		strokeSelector.disabled = false;
		strokeSelector.style.cursor = 'text';
		strokeSelector.style.color = 'black';
	}
}

tempText.oninput = () => {
	textValue = tempText.value;
	tempText.style.color = color.toString();
}

strokeSelector.oninput = () => {
	strokeWidth = strokeSelector.value;
	if (penStyle == 'eraser' && (strokeSelector.value >= 10) && (strokeSelector.value <= 15)) {
		eraserDimension = strokeSelector.value * 2;
		eraser.style.height = eraserDimension + 'px';
		eraser.style.width = eraserDimension + 'px';
	}
	else {
		eraserDimension = 10;
	}

	if (strokeSelector.value > 15) {
		alert('Stroke greater than 15 is not available');
		strokeSelector.value = 15;
		strokeWidth = 15;
		eraserDimension = 30;
		if (penStyle == 'eraser') {
			eraser.style.height = eraserDimension + 'px';
			eraser.style.width = eraserDimension + 'px';
		}
	}
	font = (parseInt(strokeWidth) * 10);
	tempText.style.fontSize = font + 'px';

}

Object.values(toolButtons).forEach(button => {

    button.onclick = function(){
       	eraser.style.height = '0px';
		eraser.style.width = '0px';
		canvas.style.cursor = 'crosshair';
		activeButton.style.color = 'black';
		strokeToggle();

		switch(button.id) {
			case 'select-pencil':
				penStyle = 'pencil';
				activeButton = pencilSelector;
				activeButton.style.color = '#0075ff';
				break;
			case 'select-line':
				penStyle = 'line';
				activeButton = lineSelector;
				activeButton.style.color = '#0075ff';
				break;
			case 'select-eraser':
				penStyle = 'eraser';
				activeButton = eraserSelector;
				eraser.style.height = eraserDimension + 'px';
				eraser.style.width = eraserDimension + 'px';
				activeButton.style.color = '#0075ff';
				break;
			case 'select-rectangle':
				penStyle = 'rectangle';
				activeButton = rectSelector;
				activeButton.style.color = '#0075ff';
				break;
			case 'select-diamond':
				penStyle = 'diamond';
				activeButton = diamondSelector;
				activeButton.style.color = '#0075ff';
				break;
			case 'select-ellipse':
				penStyle = 'ellipse';
				activeButton = ellipseSelector;
				activeButton.style.color = '#0075ff';
				break;
			case 'selector':
				penStyle = 'selector';
				activeButton = selector;
				activeButton.style.color = '#0075ff';
				break;
			case 'select-text':
				penStyle = 'text';
				activeButton = textSelector;
				strokeSelector.value = 2;
				strokeWidth = 2;
				font = (parseInt(strokeWidth) * 10);
				tempText.style.fontSize = font + 'px';
				tempText.style.color = color.toString();
				activeButton.style.color = '#0075ff';
				break;
		}
    };

});



clear.onclick = () => {
	context.clearRect(0, 0, canvas.width, canvas.height)
}

tempText.onfocus = () => {
	writing = true;
	tempX = startX;
	tempY = startY;
}

tempText.addEventListener('focusout', () => {
	writing = false;
	tempText.style.display = "none";
	tempText.style.width = tempText.style.height = "0";
	

	if (textValue != undefined) {
		context.font = font.toString() + 'px Arial';
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillText(textValue, tempX + (tempWidth / 2), tempY + (tempHeight / 2));
	}

	tempText.value = "";
	textValue = '';
})

colorPicker.oninput = () => {
	color = colorPicker.value;
}

opacitySelector.oninput = () => {
	opacity = opacitySelector.value;
}

typeSelector.oninput = (e) => {
	strokeToggle();
	
}

const canvasMouseDown = (e) => {
	mouseClicked = true;
	startX = e.clientX;
	startY = e.clientY;

	if (penStyle == "rectangle" || penStyle == 'selector' || penStyle == 'text') {
		tempRect.style.display = "block";
	}
	else if (penStyle == "ellipse") {
		tempEllipse.style.display = "block";
	}
	else if (penStyle == "line") {
		tempLine.style.display = "block";
	}

	if ( penStyle == 'selector' ) {
		tempRect.style.border = "dashed 1px" ;
		//tempRect.style.outline = "dotted"
	}
	else {
		tempRect.style.border = "solid 1px" ;
	}

	if (penStyle == 'diamond') {
		tempRect.style.display = "block";
		tempRect.style.transform = "rotate(45deg)";
	}
	else {
		tempRect.style.transform = "rotate(0deg)";
	}
}

const canvasMouseUp = (e) => {
	endX = e.clientX;
	endY = e.clientY;	
	context.lineWidth = strokeWidth;
	context.lineCap = 'round';
	context.strokeStyle = context.fillStyle = color;
	context.globalAlpha = opacity / 10;
	context.rotate(0)

	if (penStyle == 'line') {
		context.moveTo(startX, startY);
		context.lineTo(endX, endY);
		context.stroke();
		tempLine.style.display = "none";
		tempLine.style.width = "0";
	}
	else if (penStyle == 'rectangle') {
		context.rect(startX,startY,endX-startX,endY-startY);
	}
	else if(penStyle == 'selector') {
		context.clearRect(startX,startY,endX-startX,endY-startY);
	}
	

	else if (penStyle == 'ellipse') {
		context.ellipse( Math.abs(startX+(endX-startX)/2),Math.abs(startY+(endY-startY)/2),Math.abs((endX-startX)/2),Math.abs((endY-startY)/2),0,0, 2 * Math.PI);
	}

	else if (penStyle == 'eraser') {
		mouseClicked = false;
	}
	else if (penStyle == 'diamond') {	
		context.translate( startX + Math.hypot((endY - startY) / 2, (endX - startX) / 2) / 2, startY + Math.hypot((endY - startY) / 2, (endX - startX) / 2) / 2);
		context.rotate(45*Math.PI/180);
		context.translate( -(startX + Math.hypot((endY - startY) / 2, (endX - startX) / 2) / 2), -(startY + Math.hypot((endY - startY) / 2, (endX - startX) / 2) / 2));
		context.rect(startX,startY,Math.hypot((endY - startY) / 2, (endX - startX) / 2), Math.hypot((endY- startY) / 2, (endX - startX) / 2));
		context.resetTransform();
	}

	if (typeSelector.value == 'stroke') {
		context.stroke();
	}
	else if (typeSelector.value == 'fill') {
		context.fill();
	}

	if (writing == false) {
		tempText.style.display = "none";
		tempText.style.width = tempText.style.height = "0";
	}
	tempRect.style.display = "none";
	tempEllipse.style.display = "none";
	tempEllipse.style.width = tempEllipse.style.height = "0";
	tempRect.style.width = tempRect.style.height = '0';

	mouseClicked = false;
	toolMovable = false;
	canvas.style.cursor = 'crosshair';
	context.beginPath();
}

const tempRectMouseMove = (e) => {
	if (mouseClicked) {
		tempRect.style.height = e.clientY - startY + 'px';
		tempRect.style.width = e.clientX - startX + 'px';
		alignShape(e, tempRect)
	}
}

const tempLineMouseUp = (e) => {
	endX = e.clientX;
	endY = e.clientY;	
	context.lineWidth = strokeWidth;
	context.lineCap = 'round';
	context.strokeStyle = context.fillStyle = color;
	context.globalAlpha = opacity / 10;
	context.moveTo(startX, startY);
	context.lineTo(endX, endY);
	context.stroke();
	tempLine.style.display = "none";
	tempLine.style.width = "0";
	mouseClicked = false;
	context.beginPath();
}

const tempRectMouseUp = (e) => {
	endX = e.clientX;
	endY = e.clientY;	
	context.lineWidth = strokeWidth;
	context.lineCap = 'round';
	context.strokeStyle = context.fillStyle = color;
	context.globalAlpha = opacity / 10;
	if (penStyle == 'rectangle') {
		context.rect(startX,startY,endX-startX,endY-startY);
	}
	else if(penStyle == 'selector') {
		context.clearRect(startX,startY,endX-startX,endY-startY);
	}
	else if (penStyle == 'text') {
		tempText.style.height = endY - startY + 'px';
		tempText.style.width = endX - startX + 'px';
		tempText.style.display = "block";
		tempText.style.top = startY + 'px';
		tempText.style.left = startX + 'px';
		tempHeight = endY - startY;
		tempWidth = endX - startX;
		!writing;
	}
	
	if (typeSelector.value == 'stroke') {
		context.stroke();
	}
	else if (typeSelector.value == 'fill') {
		context.fill();
	}
	tempRect.style.display = "none";
	tempRect.style.width = tempRect.style.height = "0";
	mouseClicked = false;
	context.beginPath();
}

function alignShape(e, shape) {
	if ((e.clientY - startY) < 0 && (e.clientX - startX) < 0) {
		shape.style.top = 'auto';
		shape.style.left = 'auto';
		shape.style.bottom = canvas.height - startY + 'px';
		shape.style.right = canvas.width - startX + 'px';
	}
	else if ((e.clientY - startY) < 0 && (e.clientX - startX) > 0) {
		shape.style.top = 'auto';
		shape.style.left = startX + 'px';
		shape.style.bottom = canvas.height - startY + 'px';
		shape.style.right = 'auto';
	}
	else if ((e.clientY - startY) > 0 && (e.clientX - startX) < 0) {
		shape.style.top = startY + 'px';
		shape.style.left = 'auto';
		shape.style.bottom = 'auto';
		shape.style.right = canvas.width - startX + 'px';
	}
	else if ((e.clientY - startY) > 0 && (e.clientX - startX) > 0) {
		shape.style.top = startY + 'px';
		shape.style.left = startX + 'px';
		shape.style.bottom = 'auto';
		shape.style.right = 'auto';
	}
}

const draw = (e) => {
	context.lineWidth = strokeWidth;
	context.lineCap = 'round';
	context.strokeStyle = color;
	context.globalAlpha = opacity / 10;

	if (penStyle == 'pencil') {
		if (mouseClicked) {
			context.lineTo(e.clientX, e.clientY);
			context.stroke();
		}
	}

	else if (penStyle == 'eraser') {
		if (mouseClicked) {
			eraser.style.top = e.clientY + 'px';
			eraser.style.left = e.clientX + 'px';
			context.clearRect(e.clientX,e.clientY,eraserDimension,eraserDimension);
		}
	}
	else if (penStyle == 'rectangle' || penStyle == 'selector') {
		if (mouseClicked) {
			tempRect.style.height = Math.abs(e.clientY - startY) + 'px';
			tempRect.style.width = Math.abs(e.clientX - startX) + 'px';

			alignShape(e,tempRect);
		}

	}
	else if (penStyle == 'text') {
		if (mouseClicked) {
			tempRect.style.height = Math.abs(e.clientY - startY) + 'px';
			tempRect.style.width = Math.abs(e.clientX - startX) + 'px';
			tempRect.style.top = startY + 'px';
			tempRect.style.left = startX + 'px';
		}
	}
	else if (penStyle == 'diamond') {
		if (mouseClicked) {
			tempRect.style.top = startY + 'px';
			tempRect.style.left = startX + 'px';
			tempRect.style.height = Math.hypot((e.clientY - startY) / 2, (e.clientX - startX) / 2) + 'px';
			tempRect.style.width = Math.hypot((e.clientY - startY) / 2, (e.clientX - startX) / 2)  + 'px';
		}
	}
	else if (penStyle == 'ellipse') {
		if (mouseClicked) {
			tempEllipse.style.height = Math.abs(e.clientY - startY) + 'px';
			tempEllipse.style.width = Math.abs(e.clientX - startX) + 'px';
			alignShape(e, tempEllipse)

		}
	}
	else if (penStyle == 'line') {
		if (mouseClicked) {
			tempLine.style.top = startY + 'px';
			tempLine.style.left = startX + 'px';
			tempLine.style.width = Math.hypot(e.clientX - startX, e.clientY - startY) + 'px';
			var radian = Math.acos((e.clientX - startX) / Math.hypot(e.clientX - startX, e.clientY - startY));

			if ((e.clientY - startY) < 0) {
				tempLine.style.transform = 'rotate(' + (-radian*(180/Math.PI)) + 'deg)';
			}
			else {
				tempLine.style.transform = 'rotate(' + (radian*(180/Math.PI)) + 'deg)';
			}
		}
	}

	if (toolMovable) {
		tools.style.top = e.clientY - y + 'px';
		tools.style.left = e.clientX - x + 'px';
	}

}

let x;
let y;

const toolsMouseDown = (e) => {
	toolMovable = true;
	x = e.offsetX;
	y = e.offsetY;
	tools.style.cursor = 'grabbing';
}

const toolsMouseUp = () => {
	toolMovable = false;
	tools.style.cursor = 'grab';
	x = y = null;
}

const toolsMouseMove = (e) => {
	if (toolMovable) {
		tools.style.top = e.clientY - y + 'px';
		tools.style.left = e.clientX - x + 'px';
	}
}

canvas.onmousedown = canvasMouseDown;

canvas.onmouseup = canvasMouseUp;

eraser.addEventListener('mouseup', () => {
	mouseClicked = false;
})

eraser.addEventListener('mousedown', () => {
	mouseClicked = true;
})

tempRect.onmousemove = tempRectMouseMove;

tempLine.onmouseup = tempLineMouseUp;

tempRect.onmouseup = tempRectMouseUp;

canvas.onmousemove = draw;

tools.onmousedown = toolsMouseDown;

tools.onmouseup = toolsMouseUp;

tools.onmousemove = toolsMouseMove;

document.getElementById('type-selector').onmousedown = (e) => {
	e.stopPropagation();
}

document.getElementById('opacity-picker').onmousedown = (e) => {
	e.stopPropagation();
}