import p5 from "p5";
import * as env from "./environment";
import { Canvas, Ball } from "./object";

export default (p: p5) => {
  let click = false;

  let canvas = new Canvas(p);

  const map: Ball[] = []; // a non-redeclarable array of shapes (in this case just balls)

  // as long as i remains under the configured amount, assign array position of i to a new object.Ball.
  for (let i = map.length; i < env.amount; i++) {
    map[i] = new Ball(p, i == 0 ? 50 : undefined); // if the ball is the first object in the array, use diameter of 50, else use undefined.
  }

  // console.log(map);

  // let ballA = new object.Ball(50);
  // let ballB = new object.Ball();

  p.setup = () => {
    canvas.create();
  };

  p.draw = () => {
    canvas.fill(0, 0, 0.1, 1);
    map.forEach((obj) => {
      obj.render(canvas);
      interact(obj);
    });
  };

  function interact(obj) {
    let oldX = obj.x;
    let oldY = obj.y;
    if (p.dist(obj.x, obj.y, p.mouseX, p.mouseY) < obj.d / 2) {
      if (click) {
        obj.x = p.mouseX;
        obj.y = p.mouseY;
        obj.vX = p.mouseX - p.pmouseX;
        obj.vY = p.mouseY - p.pmouseY;
        // obj.g = 0;
      } else {
        obj.g = env.g / env.frameRate;
      }
    }
  }

  p.mousePressed = () => {
    click = true;
  };

  p.mouseReleased = () => {
    click = false;
  };

  p.windowResized = () => {
    canvas.resize();
  };
};
