let rand = (l, h) => ~~(l + Math.random() * (h - l));
const darkness = 60;

let img = document.querySelector("img");
let can = document.createElement("canvas");
let ctx = can.getContext("2d");
let w = can.width = Math.min(img.width, window.innerWidth);
let h = can.height = Math.min(img.height, window.innerHeight);
ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
document.body.insertBefore(can,img);
img.remove();



function getCan(can, func) {
	let {width, height} = can;
	let canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	let ctx = canvas.getContext("2d");
	ctx.drawImage(can, 0, 0, width, height);
	let data = ctx.getImageData(0, 0, width, height);
	let d = data.data;
	if (func) {
		for (let i = 0; i < d.length; i += 4) {
			func(d, i);
		}
	} else {
		for (let i = 0; i < d.length; i += 4) {
			d[i] -= darkness;
			d[i + 1] -= darkness;
			d[i + 2] -= darkness;
		}
	}
	data.data = d;
	ctx.putImageData(data, 0, 0);

	return canvas;
}


let dark_Can = getCan(can);
let red_Can = getCan(can, (d, i) => {
	d[i] -= darkness;

	d[i + 1] = d[i + 2] = 0;
});
let green_Can = getCan(can, (d, i) => {
	d[i + 1] -= darkness;

	d[i] = d[i + 2] = 0;
});
let blue_Can = getCan(can, (d, i) => {
	d[i + 2] -= darkness;

	d[i + 1] = d[i] = 0;
});

function drawCan() {

	ctx.drawImage(dark_Can, 0, 0, w, h, 0, 0, w, h);

	let space = rand(10, 60);

	ctx.globalCompositeOperation = "screen";
	ctx.drawImage(red_Can, 0, 0, w, h, -space, 0, w + space, h);
	ctx.drawImage(green_Can, 0, 0, w, h, -space/2, 0, w + space, h);
	ctx.drawImage(blue_Can, 0, 0, w, h, -space/2, 0, w + space, h);
	ctx.globalCompositeOperation = "source-over";
}

function dropCan() {
	for (let y = 0; y < h ; y += rand(70, rand(80,120))) {
		let height = rand(20, 70);
		let space = rand(10, 60);
		ctx.drawImage(dark_Can, 0, y, w, height, space, y, w, height);
		y+=height;
	}
}




setInterval(() => {
	ctx.clearRect(0,0,w,h);
	if (rand(1,11) < 5){
		drawCan();

		if (rand(1,11) < 3)
			dropCan();
	} else
		ctx.drawImage(dark_Can,0,0,w,h);
} , 300);

