const backgroundColors = [
	{
		id: "color1",
		R: 255,
		G: 255,
		B: 0,
		hex: '#ffff00',
		rgba: 'rgba(255, 255, 0, .5)'
	},
	{
		id: "color2",
		R: 255,
		G: 128,
		B: 0,
		hex: '#ff8000',
		rgba: 'rgba(255, 128, 0, .5)'
	},
	{
		id: "color3",
		R: 255,
		G: 0,
		B: 0,
		hex: '#ff0000',
		rgba: 'rgba(255, 0, 0, .5)'
	},
	{
		id: "color4",
		R: 128,
		G: 255,
		B: 0,
		hex: '#80ff00',
		rgba: 'rgba(128, 255, 0, .5)'
	},
	{
		id: "color5",
		R: 255,
		G: 255,
		B: 255,
		hex: '#ffffff',
		rgba: 'rgba(255, 255, 255, .5)'
	},
	{
		id: "color6",
		R: 255,
		G: 0,
		B: 128,
		hex: '#ff0080',
		rgba: 'rgba(255, 0, 128, .5)'
	},
	{
		id: "color7",
		R: 0,
		G: 128,
		B: 0,
		hex: '#008000',
		rgba: 'rgba(0, 128, 0, .5)'
	},
	{
		id: "color8",
		R: 0,
		G: 255,
		B: 255,
		hex: '#00ffff',
		rgba: 'rgba(0, 255, 255, .5)'
	},
	{
		id: "color9",
		R: 0,
		G: 0,
		B: 255,
		hex: '#0000ff',
		rgba: 'rgba(0, 0, 255, .5)'
	}
]

const colorPickerContainer = document.getElementById('color-picker-container');

const ColorPicker = new iro.ColorPicker("#color-picker-container", {
	width: 300,
	height: 300,
	color: { r: 255, g: 255, b: 225 },
	anticlockwise: true,
	borderWidth: 1,
	borderColor: "#000"
});

ColorPicker.on("color:change", function (color) {
	console.log(color.hsv.v);

	const R = color.rgb.r;
	const G = color.rgb.g;
	const B = color.rgb.b;

	changeColorOfText(R, G, B);

	const colorRGBA = 'rgba(' + R + ',' + G + ',' + B + ', .5)';
	const colorRGB = 'rgb(' + R + ',' + G + ',' + B + ')';

	document.getElementById("Rvalue").value = R;
	document.getElementById("Gvalue").value = G;
	document.getElementById("Bvalue").value = B;

	const inputs = document.getElementsByTagName('input');
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].style.background = colorRGB;
	}

	document.querySelector('body').style.backgroundColor = colorRGBA;
});
getDataFromArduino();
setBackgroundForDivs();

colorPickerContainer.addEventListener('click', eventListenerForColorPicker, false);
colorPickerContainer.addEventListener('touchstart', eventListenerForColorPicker, false);
colorPickerContainer.addEventListener('touchend', eventListenerForColorPicker, false);

document.getElementById('scenery1').addEventListener('click', function() {
	sendStageToArduino( 66 );
}, false);
document.getElementById('scenery2').addEventListener('click', function() {
	sendStageToArduino( 67 );
}, false);
document.getElementById('scenery3').addEventListener('click', function() {
	sendStageToArduino( 68 );
}, false);



for (let i = 1; i < 10; i++) {
	setBackground('color' + i);

	document.getElementById('color' + i).addEventListener('click', function () {
		sendRGBColor('color' + i);
	})
}
function changeColorOfText(R, G, B) {
	const containers = document.querySelectorAll('.container');
	if ( Math.max(R, G, B) < 100 ) {
		document.getElementById("Rvalue").style.color = '#fff';
		document.getElementById("Gvalue").style.color = '#fff';
		document.getElementById("Bvalue").style.color = '#fff';
		document.getElementById("brightness").style.color = '#fff';
		containers.forEach(container => {
			container.style.color = '#fff';
		});
	} else if ( ( Math.max(R, G, B) > 100 ) ) {
		document.getElementById("Rvalue").style.color = '#000';
		document.getElementById("Gvalue").style.color = '#000';
		document.getElementById("Bvalue").style.color = '#000';
		document.getElementById("brightness").style.color = '#000';
		containers.forEach(container => {
			container.style.color = '#000';
		});
	}
}
function eventListenerForColorPicker(ev) {
	ev.preventDefault();

	var R = document.getElementById("Rvalue").value;
	var G = document.getElementById("Gvalue").value;
	var B = document.getElementById("Bvalue").value;

	sendRGBToArduino(R, G, B);
}
function setBackgroundForDivs() {
	for (let i = 1; i < 10; i++) {
		setBackground('color' + i);
	
		document.getElementById('color' + i).addEventListener('click', function () {
			sendRGBColor('color' + i);
		})
	}
}
function setBackground(id) {
	const number = id.substring(5, 6);
	document.getElementById(id).style.backgroundColor = backgroundColors[number - 1].hex;
}
function sendRGBColor(id) {
	const number = id.substring(5, 6);

	document.querySelector('body').style.backgroundColor = backgroundColors[number - 1].rgba;
	const inputs = document.getElementsByTagName('input');
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].style.background = backgroundColors[number - 1].rgba;
	}

	const R = backgroundColors[number - 1].R;
	const G = backgroundColors[number - 1].G;
	const B = backgroundColors[number - 1].B;

	document.getElementById("Rvalue").value = R;
	document.getElementById("Gvalue").value = G;
	document.getElementById("Bvalue").value = B;

	sendRGBToArduino(R, G, B);
}
function sendRGBToArduino(R, G, B) {
	const type = "0";
	const otype = String.fromCharCode(type / 2);
	const outputR = String.fromCharCode(R / 2);
	const outputG = String.fromCharCode(G / 2);
	const outputB = String.fromCharCode(B / 2);

	const XHR = new XMLHttpRequest();

	XHR.open("POST", "http://192.168.1.177/", true); //192.168.1.177
	XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	XHR.send("^" + otype + outputR + outputG + outputB);
}
function sendStageToArduino( scenery ) {

	const oType = String.fromCharCode(65);
	const oScenery = String.fromCharCode(scenery);

	const XHR = new XMLHttpRequest();

	XHR.open("POST", "http://192.168.1.177/", true); //192.168.1.177
	XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	XHR.send("^" + oType + oScenery);
}
function getDataFromArduino() {
	const req = new XMLHttpRequest();

	req.open('GET', 'http://192.168.1.177/', true);
	req.send(null);
	req.onreadystatechange = function () {
		if (req.readyState == 4) {
			if (req.status == 200) {
				var response = req.getResponseHeader("Content-Type");
				document.getElementById("brightness").value = response + "%";
			} else {
				console.log("Błąd podczas ładowania strony\n");
			}
		}
	}
	setTimeout('getDataFromArduino()', 500);
}