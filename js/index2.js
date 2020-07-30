(() => {
	const graphCanvas = document.querySelector('#graph');
	const rangeCanvas = document.querySelector('#range');
	const cw = 1200;
	const ch = 500;
	graphCanvas.width = cw;
	graphCanvas.height = ch;
	rangeCanvas.width = cw;
	rangeCanvas.height = ch;
	const graphCtx = graphCanvas.getContext('2d');
	const rangeCtx = rangeCanvas.getContext('2d');
	const location = [];
	const priceData = [];
	const time = 24;
	for (let x = 0; x < time; x += 1) {
		const data = Math.floor(Math.random() * (100 - 10)) + 10;
		priceData.push(data);
	}
	let x = 0;
	const padding = cw / (time - 1);
	const dataOfpx1 = ch / Math.max(...priceData);
	for (let cnt = 0; cnt < time; cnt += 1) {
		const yPX = 500 - (priceData[cnt] * dataOfpx1);
		location.push(
			{
				x,
				y: yPX,
			}
		);
		x = x + padding;
	}
	let rangeObj = {
		start: null,
		last: null,
	}
	class Polygon {
		constructor() {
			this.lineColor = 'rgba(0,0,0,0)';
			this.fillColor = '#B3ACFF';
			this.cnt = 1;
			this.x = 0;
			this.y = ch;
		}
		clear() {
			graphCtx.clearRect(0, 0, cw, ch);
		}
		fill() {
			graphCtx.beginPath();
			graphCtx.fillStyle = this.fillColor;
			graphCtx.moveTo(0, 0);
			graphCtx.lineTo(this.x, 0);
			graphCtx.lineTo(this.x, this.y);
			graphCtx.lineTo(0, this.y);
			graphCtx.closePath();
			graphCtx.fill();
		}
		animate() {
			if (this.x < cw) {
				requestAnimationFrame(() => {
					this.animate();
				});
			}
			this.clear();
			graphCtx.save();
			this.display();
			graphCtx.clip();
			this.fill();
			graphCtx.restore();
			this.x += 50;
		}
		display() {
			graphCtx.strokeStyle = this.lineColor;
			graphCtx.beginPath();
			graphCtx.moveTo(0, location[0].y);
			for (let x = 1; x < location.length; x += 1) {
				graphCtx.lineTo(location[x - 1].x, location[x - 1].y);
				graphCtx.lineTo(location[x].x, location[x].y);
			}
			graphCtx.lineTo(cw, ch);
			graphCtx.lineTo(0, ch);
			graphCtx.lineTo(0, location[0].y);
			graphCtx.closePath();
			graphCtx.stroke();
		}
	}

	class Range {
		constructor() {
			this.lineColor = 'rgba(0,0,0,0)';
			this.fillColor = 'rgba(0,0,0,0.3)';
			this.isDrag = false;
			this.x1 = 0;
			this.x2 = 0;
			rangeCanvas.addEventListener('mousedown', (e) => {
				this.x1 = e.offsetX;
				rangeObj.start = Math.ceil(this.x1 / padding);
				this.isDrag = true;
				this.fill();
			});
			rangeCanvas.addEventListener('mouseup', (e) => {
				if (this.isDrag) {
					this.x2 = e.offsetX;
					rangeObj.last = Math.ceil(this.x2 / padding);
					this.fill();
					this.isDrag = false;
				}
			});
			document.body.addEventListener('mousemove', (e) => {
				if (this.isDrag && e.target.tagName === 'CANVAS') {
					this.x2 = e.offsetX > 0 ? e.offsetX : 1;
					rangeObj.last = Math.ceil(this.x2 / padding);
					this.fill();
				} else {
					this.isDrag = false;
					rangeObj = {
						start: null,
						last: null,
					};
				}
			});
		}
		fill() {
			rangeCtx.fillStyle = this.fillColor;
			const startX = rangeObj.start ? rangeObj.start < rangeObj.last ? rangeObj.start - 1 : rangeObj.start : null;
			const lastX = rangeObj.last ? rangeObj.start < rangeObj.last ? rangeObj.last : rangeObj.last - 1 : null;
			if (location[startX] && location[lastX]) {
				this.clear();
				rangeCtx.beginPath();
				rangeCtx.moveTo(location[startX].x, 0);
				rangeCtx.lineTo(location[lastX].x, 0);
				rangeCtx.lineTo(location[lastX].x, ch);
				rangeCtx.lineTo(location[startX].x, ch);
				rangeCtx.lineTo(location[startX].x, 0);
				rangeCtx.closePath();
				rangeCtx.fill();
			}
			if (location[startX] && !location[lastX]) {
				this.clear();
				rangeCtx.fillRect(location[rangeObj.start - 1].x, 0, Math.abs(location[rangeObj.start].x - location[rangeObj.start - 1].x), ch);
			}
			this.dataAppend();
		}
		dataAppend() {
			const timeArr = [rangeObj.start, rangeObj.last].sort((a, b) => a - b);
			const priceArr = (timeArr[0] !== timeArr[1] ? priceData.slice(timeArr[0] - 1, timeArr[1] - 1) : [priceData[timeArr[0] - 1]]).toString();
			const innerHTML = `
				범위: ${timeArr[0]} ~ ${timeArr[1]}
				<br>
				값: ${priceArr}
				`;
			document.body.querySelector('.listWrap .list').innerHTML = innerHTML;
		}
		clear() {
			rangeCtx.clearRect(0, 0, cw, ch);
		}
	}
	// 드래그 해서 사각형을 만들자 그 사각형 범위 안에 들어오는 것만 필터링
	window.onload = () => {
		let polygon = new Polygon();
		polygon.animate();
		new Range();
	};
})();