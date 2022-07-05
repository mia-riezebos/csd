import p5 from "p5";
import { NOISE } from "./noise";
import { CANVAS } from "./env";

export default class Particle {
  static particles: Particle[] = [];

  p: p5;

  mass: number;

  maxVelocity: number = 20;

  pos: p5.Vector;
  prev: p5.Vector;
  vel: p5.Vector;
  acc: p5.Vector;

  constructor(
    p: p5,
    props: {
      mass?: number;
      pos?: p5.Vector;
      vel?: p5.Vector;
      acc?: p5.Vector;
    } = {
      mass: 0.5 + Math.random(),
      pos: new p5.Vector(p.random(CANVAS.WIDTH), p.random(CANVAS.HEIGHT)),
      vel: new p5.Vector(0, 0),
      acc: new p5.Vector(0, 0),
    }
  ) {
    this.p = p;
    this.mass = props.mass;
    this.pos = props.pos;
    this.prev = this.pos.copy();
    this.vel = props.vel;
    this.acc = props.acc;
  }

  applyForce(force?: p5.Vector) {
    if (!force) {
      let n = NOISE.FIELD.get(
        Math.floor(this.pos.x * CANVAS.PIXEL_RATIO) * CANVAS.RESOLUTION
      )[Math.floor(this.pos.y * CANVAS.PIXEL_RATIO) * CANVAS.RESOLUTION];
      let angle = n * this.p.TWO_PI;
      force = p5.Vector.fromAngle(angle, 0.4 * this.mass ** 4);
    }

    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxVelocity);
    this.pos.add(this.vel);
    this.edgeWrap();
    this.acc.mult(0);
  }

  show() {
    // let c = this.p.color((this.pos.x / CANVAS.WIDTH) * 360, 100, 50, 0.01);
    let c = this.p.color(0, 100, 100, 0.01);
    this.p.stroke(c);
    this.p.strokeWeight(1);
    this.p.line(this.prev.x, this.prev.y, this.pos.x, this.pos.y);
    this.showOverflow();
    this.prev.set(this.pos);
  }

  edgeWrap() {
    if (this.pos.x >= CANVAS.WIDTH) {
      this.pos.x -= CANVAS.WIDTH;
      this.prev.x -= CANVAS.WIDTH;
    } else if (this.pos.x < 0) {
      this.pos.x += CANVAS.WIDTH;
      this.prev.x += CANVAS.WIDTH;
    }

    if (this.pos.y >= CANVAS.HEIGHT) {
      this.pos.y -= CANVAS.HEIGHT;
      this.prev.y -= CANVAS.HEIGHT;
    } else if (this.pos.y < 0) {
      this.pos.y += CANVAS.HEIGHT;
      this.prev.y += CANVAS.HEIGHT;
    }
  }

  showOverflow() {
    this.p.line(
      this.prev.x - CANVAS.WIDTH,
      this.prev.y,
      this.pos.x - CANVAS.WIDTH,
      this.pos.y
    );
    this.p.line(
      this.prev.x + CANVAS.WIDTH,
      this.prev.y,
      this.pos.x + CANVAS.WIDTH,
      this.pos.y
    );
    this.p.line(
      this.prev.x,
      this.prev.y - CANVAS.HEIGHT,
      this.pos.x,
      this.pos.y - CANVAS.HEIGHT
    );
    this.p.line(
      this.prev.x,
      this.prev.y + CANVAS.HEIGHT,
      this.pos.x,
      this.pos.y + CANVAS.HEIGHT
    );
  }
}
