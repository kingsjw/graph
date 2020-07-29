(() => {
	class Init {
		constructor() {
			this.graphCanvas = document.querySelector('#graph');
			this.rangeCanvas = document.querySelector('#range');
			this.cw = 1200;
			this.ch = 500;
			this.graphCanvas.width = this.cw;
			this.graphCanvas.height = this.ch;
			this.rangeCanvas.width = this.cw;
			this.rangeCanvas.height = this.ch;
			this.graphCtx = this.graphCanvas.getContext('2d');
			this.rangeCtx = this.rangeCanvas.getContext('2d');
			this.location = [];
			this.priceData = [];
			for (let x = 0; x < 24; x += 1) {
				const data = Math.floor(Math.random() * (1000000 - 10000)) + 10000;
				this.priceData.push(data);
			}
			console.log(this.priceData);
			this.setLocation();
			// this.grd = this.graphCtx.createLinearGradient(0, 0, this.cw, 0);
			// this.grd.addColorStop(0, "#B3ACFF");
			// this.grd.addColorStop(1, "#816bff");
		}
		setLocation() {
			let x = 0;
			const padding = this.cw / (this.priceData.length - 1);
			const dataOfpx1 = this.ch / Math.max(...this.priceData);
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
		clear() {
			this.graphCtx.clearRect(0, 0, this.cw, this.ch);
		}
		fill() {
			this.graphCtx.beginPath();
			this.graphCtx.fillStyle = this.fillColor;
			this.graphCtx.moveTo(0, 0);
			this.graphCtx.lineTo(this.x, 0);
			this.graphCtx.lineTo(this.x, this.y);
			this.graphCtx.lineTo(0, this.y);
			this.graphCtx.closePath();
			this.graphCtx.fill();
		}
		animate() {
			if (this.x < this.cw) {
				requestAnimationFrame(() => {
					this.animate();
				});
			}
			this.clear();
			this.graphCtx.save();
			this.display();
			this.graphCtx.clip();
			this.fill();
			this.graphCtx.restore();
			this.x += 50;
		}
		display() {
			this.graphCtx.strokeStyle = this.lineColor;
			this.graphCtx.beginPath();
			this.graphCtx.moveTo(0, this.location[0].y);
			for (let x = 1; x < this.location.length; x += 1) {
				this.graphCtx.lineTo(this.location[x - 1].x, this.location[x - 1].y);
				this.graphCtx.lineTo(this.location[x].x, this.location[x].y);
			}
			this.graphCtx.lineTo(this.cw, this.ch);
			this.graphCtx.lineTo(0, this.ch);
			this.graphCtx.lineTo(0, this.location[0].y);
			this.graphCtx.closePath();
			this.graphCtx.stroke();
		}
	}

	class Range extends Init{
		constructor() {
			super();
			this.fillColor = 'rgba(0,0,0,0.3)';
			this.isDrag = false;
			this.x1 = 0;
			this.x2 = 0;
			this.rangeCanvas.addEventListener('mousedown', (e) => {
				this.x1 = e.offsetX;
				this.isDrag = true;
			});
			this.rangeCanvas.addEventListener('mouseup', (e) => {
				this.x2 = e.offsetX;
				this.isDrag = false;
				if (this.x1 && this.x2) {
					this.draw();
				}
			});
			this.rangeCanvas.addEventListener('mousemove', (e) => {
				if (this.isDrag) {
					this.x2 = e.offsetX;
					this.draw();
				}
			});
		}
		draw() {
			this.clear();
			this.rangeCtx.fillStyle = this.fillColor;
			this.rangeCtx.fillRect( this.x1, 0, this.x2 - this.x1, this.ch );
			// console.log(this.x1, 0, this.x2 - this.x1, this.ch);
		}
		clear() {
			this.rangeCtx.clearRect(0, 0, this.cw, this.ch);
		}
	}
	// 드래그 해서 사각형을 만들자 그 사각형 범위 안에 들어오는 것만 필터링
	window.onload = () => {
		let polygon = new Polygon();
		polygon.animate();
		let range = new Range();
	};
})();