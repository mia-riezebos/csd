import p5 from "p5";
import { NOISE, simplex } from "./noise";
import { CANVAS } from "./env";

export default class Particle {
  static particles: Particle[] = [];

  age: boolean = false;
  lifespan: number;

  p: p5;

  mass: number;

  maxVelocity(): number {
    return 5;
  }

  pos: p5.Vector;
  prev: p5.Vector;
  vel: p5.Vector;
  acc: p5.Vector;

  color: p5.Color;

  constructor(
    p: p5,
    props: {
      age?: boolean;
      lifespan?: number;
      mass?: number;
      pos?: p5.Vector;
      vel?: p5.Vector;
      acc?: p5.Vector;
      color?: p5.Color;
    } = {
      age: false,
      lifespan: Infinity,
      mass: 1,
      pos: new p5.Vector(p.random(CANVAS.WIDTH), p.random(CANVAS.HEIGHT)),
      vel: new p5.Vector(0, 0),
      acc: new p5.Vector(0, 0),
      color: p.color(0, 0, 100, 0.1),
    }
  ) {
    this.p = p;
    this.age = props.age || false;
    this.lifespan = props.lifespan || Infinity;
    this.mass = props.mass;
    this.pos =
      props.pos ||
      new p5.Vector(p.random(CANVAS.WIDTH), p.random(CANVAS.HEIGHT));
    this.prev = this.pos.copy();
    this.vel = props.vel || new p5.Vector(0, 0);
    this.acc = props.acc || new p5.Vector(0, 0);
    this.color = props.color || p.color(0, 0, 100, 0.01);
  }

  applyForce(force?: p5.Vector) {
    if (!force) {
      let n = 0;
      for (let i = 0; i < Number(NOISE.OCTAVES.value()); i++) {
        n += NOISE.FIELD.get(simplex[i]).get(
          Math.floor(this.pos.x * CANVAS.PIXEL_RATIO) * CANVAS.RESOLUTION()
        )[Math.floor(this.pos.y * CANVAS.PIXEL_RATIO) * CANVAS.RESOLUTION()];
      }
      n /= simplex.length;
      let angle =
        n * Math.sqrt(Number(NOISE.OCTAVES.value())) * this.p.TWO_PI * 2;

      force = p5.Vector.fromAngle(angle, 1);
      force.setMag(this.p.abs(n * Math.sqrt(Number(NOISE.OCTAVES.value()))));
    }

    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc.mult(10 * this.mass ** -1.3));
    this.vel.limit(this.maxVelocity());
    this.pos.add(this.vel);
    this.edgeWrap();
    this.acc.mult(0);

    // setTimeout(() => this.update(), 1000 * CANVAS.FRAMERATE ** -1);
  }

  show() {
    // let c = this.p.color((this.pos.x / CANVAS.WIDTH) * 360, 100, 50, 0.01);

    this.p.stroke(this.color);
    this.p.strokeWeight(this.mass ** 2);
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
