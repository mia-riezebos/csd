/* TODO
 * generate 2-dimensional perlin noise
 * function to lookup noise value at x,y offset
 * convert noise to angle
 * convert angle to x,y vector
 *
 * function to generate set of notes from noise, filtered by a musical key
 * functions to reverse, rearrange & shift notes
 *
 * Notes class with methods to generate, play, stop, draw and translate.
 *
 * function to set BPM, play, framerate, etc.
 */

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
