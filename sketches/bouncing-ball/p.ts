import p5 from "p5";
import sketch from "./sketch"

let p: p5;

export function createSketch(element: HTMLElement): p5 {
  p = new p5(sketch, element);
  return p;
}

export default p;