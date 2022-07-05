import SimplexNoise from "simplex-noise";
import { CANVAS, DRAW_MODES } from "./env";
import p5 from "p5";

export let simplex: SimplexNoise;

export const NOISE: {
  MODES: {
    PERLIN: { NAME: string; MIN: number; MAX: number };
    SIMPLEX: { NAME: string; MIN: number; MAX: number };
  };
  OFFSET: p5.Vector;
  INCREMENT: p5.Vector;
  FIELD: Map<number, number[]>;
} = {
  MODES: {
    PERLIN: {
      NAME: "perlin",
      MIN: 0,
      MAX: 1,
    },
    SIMPLEX: {
      NAME: "simplex",
      MIN: -1,
      MAX: 1,
    },
  },
  OFFSET: new p5.Vector(0, 0, 0),
  INCREMENT: new p5.Vector(0.002, 0.002, 0),
  FIELD: new Map(),
};

export const EVOLUTION = {
  STATE: false,
  MAX: 0.005,
  MIN: 1e-5,
};

export let noise2D;
export let noise3D;
export let noise4D;

export default function noise(
  p: p5,
  noise_mode: { NAME: string; MIN: number; MAX: number },
  opts:
    | {
        x: number;
        y?: number;
        z?: number;
      }
    | p5.Vector = { x: 0, y: 0, z: 0 }
) {
  if (noise_mode === NOISE.MODES.PERLIN) return p.noise(opts.x, opts.y, opts.z);
  if (noise_mode === NOISE.MODES.SIMPLEX)
    return simplex.noise3D(opts.x, opts.y, opts.z);
}

export function initNoise(
  p,
  noise_mode: { NAME: string; MIN: number; MAX: number },
  seed: number = Math.random()
) {
  if (noise_mode === NOISE.MODES.SIMPLEX) {
    if (!simplex) simplex = new SimplexNoise(seed);

    noise3D = simplex.noise2D;
    noise3D = simplex.noise3D;
    noise3D = simplex.noise4D;
  }

  [NOISE.OFFSET.x, NOISE.OFFSET.y] = [0, 0];

  for (let x = 0; x < CANVAS.WIDTH; x++) {
    if (!NOISE.FIELD.has(x)) NOISE.FIELD.set(x, []);

    NOISE.OFFSET.y = 0;
    for (let y = 0; y < CANVAS.HEIGHT; y++) {
      let n = noise(p, noise_mode, NOISE.OFFSET);
      NOISE.FIELD.get(x)[y] = n;
      NOISE.OFFSET.y += NOISE.INCREMENT.y;
    }
    NOISE.OFFSET.x += NOISE.INCREMENT.x;
  }

  evolveNoise(p, noise_mode);
}

export function showNoise(
  p,
  noise_mode: { NAME: string; MIN: number; MAX: number },
  draw_mode = DRAW_MODES.PIXELS
) {
  [NOISE.OFFSET.x, NOISE.OFFSET.y] = [0, 0];

  switch (draw_mode) {
    case DRAW_MODES.PIXELS:
      p.loadPixels();
      for (let x = 0; x < CANVAS.WIDTH; x++) {
        NOISE.OFFSET.y = 0;
        for (let y = 0; y < CANVAS.HEIGHT; y++) {
          // let n = NOISE.FIELD.get(
          // Math.floor(x * CANVAS.RESOLUTION) * CANVAS.PIXEL_RATIO
          // )[Math.floor(y * CANVAS.RESOLUTION) * CANVAS.PIXEL_RATIO];
          let n = NOISE.FIELD.get(x)[y];
          let c = p.color(
            p.map(n, noise_mode.MIN, noise_mode.MAX, 0, 360),
            100,
            75,
            p.abs(p.map(n, noise_mode.MIN, noise_mode.MAX, -1, 1))
          );

          p.set(x, y, c);

          NOISE.OFFSET.y += NOISE.INCREMENT.y;
        }
        NOISE.OFFSET.x += NOISE.INCREMENT.x;
      }
      p.updatePixels();
      break;
    case DRAW_MODES.RECTANGLES:
      for (let x = 0; x < CANVAS.COLUMNS; x++) {
        NOISE.OFFSET.y = 0;
        for (let y = 0; y < CANVAS.ROWS; y++) {
          let n = NOISE.FIELD.get(Math.floor(x * CANVAS.RESOLUTION))[
            Math.floor(y * CANVAS.RESOLUTION)
          ];
          let c = p.color(
            p.map(n, noise_mode.MIN, noise_mode.MAX, 0, 360),
            100,
            75,
            p.abs(p.map(n, noise_mode.MIN, noise_mode.MAX, -1, 1))
          );

          p.fill(c);

          p.rect(
            x * CANVAS.RESOLUTION,
            y * CANVAS.RESOLUTION,
            1 * CANVAS.RESOLUTION,
            1 * CANVAS.RESOLUTION
          );

          NOISE.OFFSET.y += NOISE.INCREMENT.y;
        }
        NOISE.OFFSET.x += NOISE.INCREMENT.x;
      }
      break;
  }
}

/**
 *
 * @param p
 * @param noise_mode
 */
export function showField(
  p,
  noise_mode: { NAME: string; MIN: number; MAX: number }
) {
  [NOISE.OFFSET.x, NOISE.OFFSET.y] = [0, 0];
  NOISE.INCREMENT.div(CANVAS.PIXEL_RATIO);

  for (let x = 0; x < CANVAS.COLUMNS; x++) {
    NOISE.OFFSET.y = 0;
    for (let y = 0; y < CANVAS.ROWS; y++) {
      let n = NOISE.FIELD.get(Math.floor(x * CANVAS.RESOLUTION))[
        Math.floor(y * CANVAS.RESOLUTION)
      ];
      let angle = n * p.PI;

      let vector = p5.Vector.fromAngle(angle);

      p.push();
      p.translate(
        x * CANVAS.RESOLUTION + 0.5 * CANVAS.RESOLUTION,
        y * CANVAS.RESOLUTION + 0.5 * CANVAS.RESOLUTION
      );
      p.rotate(vector.heading());
      p.line(0, 0, 1 * CANVAS.RESOLUTION, 0);
      p.pop();

      NOISE.OFFSET.y += NOISE.INCREMENT.y;
    }
    NOISE.OFFSET.x += NOISE.INCREMENT.x;
  }

  NOISE.INCREMENT.mult(CANVAS.PIXEL_RATIO);
}

export async function evolveNoise(
  p: p5,
  noise_mode: { NAME: string; MIN: number; MAX: number }
) {
  [NOISE.OFFSET.x, NOISE.OFFSET.y] = [0, 0];

  for (let x = 0; x < CANVAS.COLUMNS; x++) {
    if (!NOISE.FIELD.has(x * CANVAS.RESOLUTION))
      NOISE.FIELD.set(x * CANVAS.RESOLUTION, []);

    NOISE.OFFSET.y = 0;
    for (let y = 0; y < CANVAS.ROWS; y++) {
      let n = noise(p, noise_mode, NOISE.OFFSET);
      NOISE.FIELD.get(x * CANVAS.RESOLUTION)[y * CANVAS.RESOLUTION] = n;
      NOISE.OFFSET.y += NOISE.INCREMENT.y * CANVAS.RESOLUTION;
    }
    NOISE.OFFSET.x += NOISE.INCREMENT.x * CANVAS.RESOLUTION;
  }

  NOISE.OFFSET.z += NOISE.INCREMENT.z;
  let acc = 1 + (EVOLUTION.STATE ? 0.1 : -1e-27);

  NOISE.INCREMENT.z < EVOLUTION.MAX * 0.1
    ? EVOLUTION.STATE
      ? (NOISE.INCREMENT.z = EVOLUTION.MAX * 0.1)
      : NOISE.INCREMENT.z < EVOLUTION.MIN
      ? (NOISE.INCREMENT.z = 0)
      : null
    : null;
  NOISE.INCREMENT.z *= NOISE.INCREMENT.z < EVOLUTION.MAX ? acc : 1;
  if (!EVOLUTION.STATE) NOISE.INCREMENT.z *= 0.9;

  if (NOISE.INCREMENT.z > EVOLUTION.MIN)
    setTimeout(() => evolveNoise(p, noise_mode), 7);
}
