import p5 from "p5";
export default (p: p5) => {
  const canvas = {
    width: () => p.min(700, document.body.clientWidth - 80),
    height: 410,
  };

  let x = 100;

  let y = 100;

  p.setup = function () {
    p.createCanvas(canvas.width(), canvas.height);
  };
  p.draw = function () {
    p.background(0);

    p.fill(255);

    p.rect(x, y, 50, 50);
  };

  p.windowResized = () => {
    p.resizeCanvas(canvas.width(), canvas.height);
  };
};
