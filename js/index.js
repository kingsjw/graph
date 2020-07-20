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
			this.setLocation();
		}
		setLocation() {
			const kan = this.cw / (this.priceData.length - 1);
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
				x = x + kan;
			}
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
		}
		fillOne() {
			this.ctx.save();
			this.ctx.fillStyle = this.fillColor;
			const maxY = Math.max(...[this.location[this.cnt - 1].y, this.location[this.cnt].y]);
			const minY = Math.min(...[this.location[this.cnt - 1].y, this.location[this.cnt].y]);
			const max = maxY - minY;
			let aniY = this.location[this.cnt - 1].y;
			let aniX = this.location[this.cnt - 1].x;
			let x1 = this.location[this.cnt].x / max;
			console.log(x1);
			this.ctx.beginPath();
			console.log(aniX, aniY);
			console.log(aniX + x1, aniY - 1);
			console.log(aniX + x1, 500);
			console.log(0, 500);
			this.ctx.lineTo(aniX, aniY);
			this.ctx.lineTo(aniX + x1, aniY - 1);
			this.ctx.lineTo(aniX + x1, 500);
			this.ctx.lineTo(0, 500);
			this.ctx.closePath();
			this.ctx.fill();
			aniX += x1;
			aniY -= 1;
			if (minY <= aniY) {
				requestAnimationFrame(() => {
					setTimeout(() => {
						this.fillOne();
					}, 10);
				});
			}
		}
		display() {
			// if (this.cnt < this.location.length - 1) {
			// 	requestAnimationFrame(() => {
			// 		setTimeout(() => {
			// 			this.display();
			// 		}, 60);
			// 	});
			// }
			this.fillOne();
			this.cnt += 1;
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