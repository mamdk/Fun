//Book class
class Book {
	constructor(txt = "test", color = "#cccccc" , bgColor = "#101010", can_id = "can", w = window.innerWidth, h = window.innerHeight, circle = false, size = 55 , fast = false) {
		this.text = txt.split("");
		this.deg = 0;
		this.circle = circle;
		this.total = (this.circle) ? 360 : 180;
		this.between = this.total / this.text.length;
		this.can = document.querySelector(`#${can_id}`);
		this.ctx = this.can.getContext("2d");
		this.h = h;
		this.w = w;
		this.size = size;
		this.color = color;
		this.bgc = bgColor;
		this.arr = [];
		this.rtl = true;
		this.fit = !this.circle;
		this.num = (fast) ? 2 : 1;
	}

	rand = (l, h) => ~~(l + Math.random() * (h - l));

	degToRad = (deg) => deg * Math.PI / 180;

	update() {
		if (this.rtl) {
			if (this.arr[this.arr.length - 1] && this.arr[this.arr.length - 1].deg <= -this.total) this.rtl = false;
			for (let i = 0; i < this.arr.length; i++) {
				if (this.arr[i].deg <= -this.total) continue;
				if ((this.arr[i - 1] && ((Math.abs((this.arr[i - 1].deg) - (this.arr[i].deg)) >= (this.between)) || this.arr[i - 1].deg <= -this.total)) || i === 0)
					this.arr[i].deg -= this.num;
			}
		} else {
			if (this.arr[0] && this.arr[0].deg >= 0) this.rtl = true;
			for (let i = 0; i < this.arr.length; i++) {
				if (this.arr[i].deg >= 0) continue;
				if ((this.arr[i + 1] && ((Math.abs((this.arr[i + 1].deg) - (this.arr[i].deg)) >= (this.between)) || this.arr[i + 1].deg >= 0)) || i === this.arr.length - 1)
					this.arr[i].deg += this.num;
			}
		}
	}

	createLetter() {
		if (this.arr.length !== this.text.length)
			if ((this.arr[this.arr.length - 1] && this.arr[this.arr.length - 1].deg < -this.between) || !this.arr.length)
				this.arr.push({name: this.text[this.arr.length], deg: 0});

	}

	draw() {
		let r = ((this.fit) ? ((Math.min(this.w, this.h)) - (this.size * 2) ) : ~~(Math.min(this.w, this.h)) / 2) - this.size;
		for (let letter of this.arr) {
			let rad = this.degToRad(letter.deg);
			let x = (Math.cos(rad) * r) + ~~(this.w / 2);
			let y = (Math.sin(rad) * r) + ((this.circle) ? ~~(this.h / 2) : this.h);
			let xl = (Math.cos(rad) * (r - this.size)) + ~~(this.w / 2);
			let yl = (Math.sin(rad) * (r - this.size)) + ((this.circle) ? ~~(this.h / 2) : this.h);
			this.ctx.beginPath();
			this.ctx.font = `${this.size}px Comic Sans MS`;
			this.ctx.fillStyle = this.color;
			this.ctx.textAlign = "center";
			this.ctx.fillText(letter.name.toUpperCase(), x, y);
			this.ctx.lineWidth = 2;
			this.ctx.strokeStyle = this.color;
			this.ctx.moveTo(~~(this.w / 2), (this.circle) ? ~~(this.h / 2) : this.h);
			this.ctx.lineTo(xl, yl - 5);
			this.ctx.stroke();
			this.ctx.closePath();
		}

	}

	clear() {
		this.ctx.clearRect(0, 0, this.w, this.h);
		this.ctx.fillStyle = this.bgc;
		this.ctx.fillRect(0, 0, this.w, this.h);
	}

	anime() {
		requestAnimationFrame(() => this.anime())
		this.clear();
		this.update();
		this.createLetter();
		this.draw();
	}

	get show() {
		this.can.width = this.w;
		this.can.height = this.h;
		this.ctx.fillStyle = this.bgc;
		this.ctx.fillRect(0, 0, this.w, this.h);
		this.anime();
	}
}

//Create new Book
let draw = new Book().show;
