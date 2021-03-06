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
];

const ipAdress = 'http://192.168.0.177/';

const colorPickerContainer = document.getElementById('color-picker-container');

const ColorPicker = new iro.ColorPicker("#color-picker-container", {
	width: 300,
	height: 300,
	color: { r: 255, g: 0, b: 0 },
	anticlockwise: true,
	borderWidth: 1,
	borderColor: "#000"
});

ColorPicker.on("color:change", function (color) {
	const R = color.rgb.r;
	const G = color.rgb.g;
	const B = color.rgb.b;

	const H = color.hsv.h;
	const S = color.hsv.s;
	const V = color.hsv.v;

	changeColorOfText(R, G, B);

	const colorRGBA = `rgba(${R}, ${G}, ${B}, .5)`;
	const colorRGB = `rgb(${R}, ${G}, ${B})`;

	document.getElementById("Rvalue").value = R;
	document.getElementById("Gvalue").value = G;
	document.getElementById("Bvalue").value = B;

	document.getElementById("Hvalue").value = H;
	document.getElementById("Svalue").value = S;
	document.getElementById("Vvalue").value = V;

	const inputs = document.getElementsByTagName('input');
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].style.background = colorRGB;
	}

	document.querySelector('body').style.backgroundColor = colorRGBA;
});
//document.getElementById("brightness").value = "52%";
getDataFromArduino();
setBackgroundForDivs();

colorPickerContainer.addEventListener('click', eventListenerForColorPicker, false);
colorPickerContainer.addEventListener('touchstart', eventListenerForColorPicker, false);
colorPickerContainer.addEventListener('touchend', eventListenerForColorPicker, false);

document.getElementById('scenery1').addEventListener('click', function () {
	sendStageToArduino(66);
}, false);
document.getElementById('scenery2').addEventListener('click', function () {
	sendStageToArduino(67);
}, false);
document.getElementById('scenery3').addEventListener('click', function () {
	sendStageToArduino(68);
}, false);

function changeColorOfText(R, G, B) {
	const containers = document.querySelectorAll('.container');
	if (Math.max(R, G, B) < 100) {
		document.getElementById("Rvalue").style.color = '#fff';
		document.getElementById("Gvalue").style.color = '#fff';
		document.getElementById("Bvalue").style.color = '#fff';
		document.getElementById("brightness").style.color = '#fff';
		containers.forEach(container => {
			container.style.color = '#fff';
		});
	} else if ((Math.max(R, G, B) > 100)) {
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

	[H, S, V] = rgb2Hsv(R, G, B);

	document.getElementById("Rvalue").value = R;
	document.getElementById("Gvalue").value = G;
	document.getElementById("Bvalue").value = B;

	document.getElementById("Hvalue").value = H;
	document.getElementById("Svalue").value = S;
	document.getElementById("Vvalue").value = V;

	sendRGBToArduino(R, G, B);
}
function rgb2Hsv(rr, gg, bb) {
	const r = rr / 255;
	const g = gg / 255;
	const b = bb / 255;

	const	max = Math.max(r, g, b);
	const	min = Math.min(r, g, b);
	const	delta = max - min;
	let	hue;

	switch (max) {
		case min:
			hue = 0;
			break;

		case r:
			hue = (g - b) / delta + (g < b ? 6 : 0);
			break;

		case g:
			hue = (b - r) / delta + 2;
			break;

		case b:
			hue = (r - g) / delta + 4;
			break;
	}

	hue /= 6;

	const h = Math.round(hue * 360);
	const s = Math.round(max == 0 ? 0 : delta / max * 100);
	const v = Math.round(max * 100);

	return [h, s, v];
};
function sendRGBToArduino(R, G, B) {
	const type = "0";
	const otype = String.fromCharCode(type / 2);
	const outputR = String.fromCharCode(R / 2);
	const outputG = String.fromCharCode(G / 2);
	const outputB = String.fromCharCode(B / 2);

	fetch(ipAdress, {
		method: 'POST',
		body: "^" + otype + outputR + outputG + outputB,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}).then(res => res.text())
		.catch(error => console.error('Error:', error));
}
function sendStageToArduino(scenery) {
	const quantityLoops = document.getElementById("quantityLoops").value;
	const decimal = Math.floor(quantityLoops / 10);
	const unity = quantityLoops % 10;
	const oType = String.fromCharCode(65);
	const oScenery = String.fromCharCode(scenery);
	
console.log(decimal);
console.log(unity);
	fetch(ipAdress, {
		method: 'POST',
		body: "^" + oType + decimal + unity + oScenery,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}).then(res => res.text())
		.catch(error => console.error('Error:', error));
}
function getDataFromArduino() {
	fetch(ipAdress, {
		method: 'GET'
	})
		.then(res => document.getElementById("brightness").value = res.headers.get("content-type") + "%")
		.catch(error => console.error('Error:', error));

	setTimeout('getDataFromArduino()', 500);
}