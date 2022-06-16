(() => {
  const cnv = document.querySelector("canvas");
  const ctx = cnv.getContext("2d");

  const cfg = {
    orbsCount: 1000,
    minVelocity: 0.2,
    ringCount: 10,
  }
  let mx = 0, my = 0;
  cnv.addEventListener(`mousemove`, e => {
      mx = e.clientX - cnv.getBoundingClientRect().left;
      my = e.clientY - cnv.getBoundingClientRect().top;
  })
  let cw, ch, cx, cy, ph, pw;

  function resize() {
    cw = cnv.width = innerWidth;
    ch = cnv.height = innerHeight;
    cx = cw * 0.5;
    cy = ch * 0.5;
    ph = cy * 0.4;
    pw = cx * 0.4;
  }
  resize();
  window.addEventListener("resize", resize);

  class Orb {
    constructor() {
      this.size = Math.random() * 5 + 2;
      this.angle = Math.random() * 360;
      this.radius =
        (((Math.random() * cfg.ringCount) | 0) * ph) / cfg.ringCount;
      this.impact = this.radius / ph;
      this.velocity = cfg.minVelocity + Math.random() * cfg.minVelocity + this.impact;
    }
    refresh() {
      let radian = (this.angle * Math.PI) / 180;

      let cos = Math.cos(radian);
      let sin = Math.sin(radian);

      let offsetX = cos * pw * this.impact;
      let offsetY = sin * pw * this.impact;

      let paralaxX = mx / cw * 2 - 1;
      let paralaxY = my / ch;

      let x = cx + cos * (ph + this.radius) + offsetX;
      let y = cy + sin * (ph + this.radius) - offsetY * paralaxY - paralaxX * offsetX;
      let distToC = Math.hypot(x - cx, y - cy);
      let distToM = Math.hypot(x - mx, y - my);
      
      let optic = sin * this.size * this.impact * 0.7;
      let mEffect = distToM <= 50 ? (1 - distToM / 50) * 25 : 0;
      let size = this.size + optic + mEffect;


      let h = this.angle;
      let s = 100;
      let l = (1 - Math.sin(this.impact * Math.PI)) * 90 + 10;
      let color = `hsl(${h}, ${s}%, ${l}%)`;

      if (distToC > ph - 1 || sin > 0) {
        ctx.strokeStyle = ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        distToM <= 50 ? ctx.stroke() : ctx.fill();
      }

      this.angle = (this.angle + this.velocity) % 360;
    }
  }

  let orbsList = [];
  function createStardust() {
    for (let i = 0; i < cfg.orbsCount; i++) {
      orbsList.push(new Orb());
    }
  }
  createStardust();
  let bg1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
  bg1.addColorStop(0, `rgb(255, 255, 255)`);
  bg1.addColorStop(.15, `rgb(255, 255, 255)`);
  bg1.addColorStop(.16, `rgb(255, 200, 0)`);
  bg1.addColorStop(.23, `rgb(255, 0, 0)`);
  bg1.addColorStop(.45, `rgb(255, 0, 25)`);
  bg1.addColorStop(.85, `rgb(9, 9, 25)`);
  bg1.addColorStop(1, `rgb(0, 0, 20)`);
 

  function loop() {
    requestAnimationFrame(loop);
    ctx.globalCompositeOperation = `normal`;
    ctx.fillStyle = bg1;
    ctx.fillRect(0, 0, cw, ch);
    ctx.globalCompositeOperation = `lighter`;
    orbsList.map((e) => e.refresh());
  }
  loop();
})();
