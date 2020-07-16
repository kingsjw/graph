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
			this.lienLocation = [];
			this.priceData = [20000, 60000, 0, 10000, 80000, 40000, 60000, 70000, 30000, 100000];
			this.setLocation();
		}
		setLocation() {
			const kan = this.cw / (this.priceData.length - 1);
			let x = 0; // 그래프의 x좌표
			const dataOfpx1 = this.ch / Math.max(...this.priceData); // y좌표 1px 당 data값
			for (let cnt = 0; cnt < this.priceData.length; cnt += 1) {
				const yPX = 500 - (this.priceData[cnt] * dataOfpx1);
				this.lienLocation.push(
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

	class Line extends Init{
		constructor() {
			super();
			this.lineColor = '#000';
			this.fillColor = '#000';
			this.cnt = 1;
		}
		display() {
			if (this.cnt < this.lienLocation.length - 1) {
				requestAnimationFrame(() => {
					setTimeout(() => {
						this.display();
					}, 60);
				});
			}
			this.ctx.save();
			this.ctx.strokeStyle = this.lineColor;
			this.ctx.fillStyle = this.fillColor;
			this.ctx.beginPath();
			this.ctx.moveTo(this.lienLocation[this.cnt - 1].x, this.lienLocation[this.cnt - 1].y);
			this.ctx.lineTo(this.lienLocation[this.cnt].x, this.lienLocation[this.cnt].y);
			this.ctx.closePath();
			this.ctx.stroke();
			this.ctx.fill();
			this.cnt += 1;
		}
	}

	window.onload = () => {
		let line = new Line();
		line.display();
	};
})();