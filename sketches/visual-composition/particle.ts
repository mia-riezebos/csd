import p5 from "p5";
import p from "./p";

export default class Particle {
  
  mass: number;

  pos: p5.Vector;
  vel: p5.Vector;
  acc: p5.Vector;

  constructor(props: {
    pos?: p5.Vector;
    vel?: p5.Vector;
    acc?: p5.Vector;
  } = {
    // TODO defaults?
  }) {
    // TODO constructor
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  applyForce(force: p5.Vector) {
    this.acc.add(force);
  }
}