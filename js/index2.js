(() => {
	class Init {
		constructor() {
			const canvas = document.querySelector('#graph');
			canvas.width = 1200;
			canvas.height = 500;
			this.ctx = canvas.getContext('2d');
			this.ctx.lineWidth = 1;
			this.ctx.lineCap = 'round';
			this.ctx.globalCompositeOperation='destination-over';
			this.cw = canvas.width;
			this.ch = canvas.height;
			this.location = [];
			this.priceData = [20000, 60000, 5000, 10000, 80000, 40000, 60000, 70000, 30000, 10000, 50000, 4000, 65000, 72000];
			this.setLocation();
			this.grd = this.ctx.createLinearGradient(0, 0, this.cw, 0);
			this.grd.addColorStop(0, "#B3ACFF");
			this.grd.addColorStop(1, "#816bff");
		}
		setLocation() {
			let x = 0; // 그래프의 x좌표
			const padding = this.cw / (this.priceData.length - 1);
			const dataOfpx1 = this.ch / Math.max(...this.priceData); // y좌표 1px 당 data값
			for (let cnt = 0; cnt < this.priceData.length; cnt += 1) {
				const yPX = 500 - (this.priceData[cnt] * dataOfpx1);
				this.location.push(
					{
						x: x,
						y: yPX,
					}
				);
				x = x + padding;
			}
		}
		clear() {
			this.ctx.clearRect(0, 0, this.cw, this.ch);
		}
	}
	class Polygon extends Init {
		constructor() {
			super();
			this.lineColor = 'rgba(0,0,0,0)';
			this.fillColor = '#B3ACFF';
			this.cnt = 1;
			this.x = 0;
			this.y = this.ch;

		}
		fill() {
			this.ctx.beginPath();
			this.ctx.fillStyle = this.grd;
			this.ctx.moveTo(0, 0);
			this.ctx.lineTo(this.x, 0);
			this.ctx.lineTo(this.x, this.y);
			this.ctx.lineTo(0, this.y);
			this.ctx.closePath();
			this.ctx.fill();
		}
		animate() {
			if (this.x < this.cw) {
				requestAnimationFrame(() => {
					this.animate();
				});
			}
			this.clear();
			this.ctx.save();
			this.display();
			this.ctx.save();
			this.ctx.clip();
			this.fill();
			this.ctx.restore();
			this.x += 10;
		}
		display() {
			this.ctx.strokeStyle = this.lineColor;
			this.ctx.beginPath();
			this.ctx.moveTo(0, this.location[0].y);
			for (let x = 1; x < this.location.length; x += 1) {
				this.ctx.lineTo(this.location[x - 1].x, this.location[x - 1].y);
				this.ctx.lineTo(this.location[x].x, this.location[x].y);
			}
			this.ctx.lineTo(this.cw, this.ch);
			this.ctx.lineTo(0, this.ch);
			this.ctx.lineTo(0, this.location[0].y);
			this.ctx.closePath();
			this.ctx.stroke();
		}
	}

	window.onload = () => {
		let polygon = new Polygon();
		polygon.animate();
	};
})();