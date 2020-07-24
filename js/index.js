(() => {
	class Init {
		constructor() {
			const canvas = document.querySelector('#graph');
			canvas.width = 1200;
			canvas.height = 500;
			this.ctx = canvas.getContext('2d');
			this.ctx.lineWidth = 1;
			this.ctx.lineCap = 'round';
			this.cw = canvas.width;
			this.ch = canvas.height;
			this.location = [];
			this.priceData = [20000, 60000, 0, 10000, 80000, 40000, 60000, 70000, 30000, 100000];
			this.kan = this.cw / (this.priceData.length - 1);
			this.setLocation();
		}
		setLocation() {
			let x = 0; // 그래프의 x좌표
			const dataOfpx1 = this.ch / Math.max(...this.priceData); // y좌표 1px 당 data값
			for (let cnt = 0; cnt < this.priceData.length; cnt += 1) {
				const yPX = 500 - (this.priceData[cnt] * dataOfpx1);
				this.location.push(
					{
						x: x,
						y: yPX,
					}
				);
				x = x + this.kan;
			}
			console.log(this.location);
		}
		clear() {
			this.ctx.clearRect(0, 0, this.cw, this.ch);
		}
	}
	class Polygon extends Init {
		constructor() {
			super();
			this.fillColor = '#B3ACFF';
			this.cnt = 1;
			this.nowX = this.location[this.cnt - 1].x;
			this.nowY = this.location[this.cnt - 1].y;
			this.x = this.location[this.cnt - 1].x;
			this.y = this.location[this.cnt - 1].y;
			this.nextX = this.location[this.cnt].x;
			this.nextY = this.location[this.cnt].y;
			this.dir = '';
			this.x1 = 0;
			this.iterCnt = 0;
		}
		fill() {
			this.ctx.fillStyle = this.fillColor;
			this.ctx.save();
			this.ctx.beginPath();
			console.log(this.cnt);
			console.log(`1: (${this.nowX}, ${this.nowY}), 2: (${this.nowX + this.x1}, ${eval(`${this.nowY}${this.dir}1`)}), 3: (${this.nowX + this.x1}, ${this.ch}), 4: (0, ${this.ch})`)
			this.ctx.lineTo(this.nowX.toFixed(0), this.nowY.toFixed(0));
			this.ctx.lineTo((this.nowX + this.x1).toFixed(0), eval(`${this.nowY}${this.dir}1`).toFixed(0));
			this.ctx.lineTo((this.nowX + this.x1).toFixed(0), this.ch.toFixed(0));
			this.ctx.lineTo(this.x.toFixed(0), this.ch.toFixed(0));
			this.ctx.closePath();
			this.ctx.fill();
		}
		* run() {
			for (let x = 0; x < 300; x += 1) {
				yield new Promise((resolve) => {
					setTimeout(() => {
						resolve();
					}, 1);
				});
			}
		}
		async	display() {
			for (; this.cnt < this.location.length;) {
				if (this.y > this.nextY) {
					this.dir = '-';
					this.iterCnt = this.y - this.nextY;
				} else {
					this.dir = '+';
					this.iterCnt = this.nextY - this.y;
				}
				this.x1 = this.kan / 300;
				for await (const f of this.run()) {
					// console.log(this.nowX, this.nowY);
					this.fill();
					this.nowX += this.x1;
					this.nowY = this.nowY + ((this.nextY - this.y) / 300);
				}
				// console.log('현재 x 좌표: ', this.nowX);
				// console.log('다음');
				this.cnt += 1;
				this.x = this.location[this.cnt - 1].x;
				this.y = this.location[this.cnt - 1].y;
				if (this.location[this.cnt]) {
					this.nextX = this.location[this.cnt].x;
					this.nextY = this.location[this.cnt].y;
				}
			}
		}
	}

	class Line extends Init {
		constructor() {
			super();
			this.lineColor = '#7167ff';
			this.cnt = 1;
		}
		display() {
			if (this.cnt < this.location.length - 1) {
				requestAnimationFrame(() => {
					setTimeout(() => {
						this.display();
					}, 60);
				});
			}
			this.ctx.save();
			this.ctx.lineWidth = 2;
			this.ctx.strokeStyle = this.lineColor;
			this.ctx.beginPath();
			this.ctx.moveTo(this.location[this.cnt - 1].x, this.location[this.cnt - 1].y);
			this.ctx.lineTo(this.location[this.cnt].x, this.location[this.cnt].y);
			this.ctx.closePath();
			this.ctx.stroke();
			this.cnt += 1;
		}
	}

	window.onload = () => {
		let line = new Line();
		let polygon = new Polygon();
		line.display();
		polygon.display();
	};
})();