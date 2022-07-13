import SimplexNoise from "simplex-noise";
import { CANVAS, DRAW_MODES, COLOR } from "./env";
import p5 from "p5";

export let simplex: SimplexNoise[] = [];

export const NOISE: {
  OCTAVES: p5.Element;
  MAX_OCTAVES: number;
  MODES: {
    SIMPLEX: { NAME: string; MIN: number; MAX: number };
  };
  OFFSET: p5.Vector;
  INCREMENT: p5.Vector;
  FIELD: Map<SimplexNoise, Map<number, number[]>>;
} = {
  OCTAVES: null,
  MAX_OCTAVES: 32,
  MODES: {
    SIMPLEX: {
      NAME: "simplex",
      MIN: -1,
      MAX: 1,
    },
  },
  OFFSET: new p5.Vector(0, 0, 0),
  INCREMENT: new p5.Vector(0.003, 0.003, 0),
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
  octave: SimplexNoise,
  opts:
    | {
        x: number;
        y?: number;
        z?: number;
      }
    | p5.Vector = { x: 0, y: 0, z: 0 }
) {
  return octave.noise3D(opts.x, opts.y, opts.z);
}

export function initNoise(p: p5) {
  if (simplex.length < NOISE.OCTAVES.value()) {
    for (let i = 0; i < NOISE.OCTAVES.value(); i++) {}
  }

  for (let i = 0; i < NOISE.OCTAVES.value(); i++) {
    if (NOISE.FIELD.has(simplex[i])) continue;

    initOctaveSync(p, i);
  }
}
export let initOctave = async (p, i) => {
  initOctaveSync(p, i);
};
function initOctaveSync(p, i) {
  if (NOISE.FIELD.has(simplex[i])) return;
  console.info("generating noise field for octave", i);

  if (!simplex[i]) simplex[i] = new SimplexNoise();

  NOISE.FIELD.set(simplex[i], new Map());

  [NOISE.OFFSET.x, NOISE.OFFSET.y] = [0, 0];

  for (let x = 0; x < CANVAS.WIDTH; x++) {
    if (NOISE.FIELD.get(simplex[i]).has(x)) continue;

    NOISE.FIELD.get(simplex[i]).set(x, []);

    NOISE.OFFSET.y = 0;
    for (let y = 0; y < CANVAS.HEIGHT; y++) {
      if (NOISE.FIELD.get(simplex[i]).get(x)[y]) continue;
      let n = noise(p, simplex[i], NOISE.OFFSET);
      NOISE.FIELD.get(simplex[i]).get(x)[y] = n;
      NOISE.OFFSET.y += NOISE.INCREMENT.y * (i + 1);
    }
    NOISE.OFFSET.x += NOISE.INCREMENT.x * (i + 1);
  }
}
function redrawOctaveSync(p, i) {
  // if (NOISE.FIELD.has(simplex[i])) return;
  console.log("redrawing noise field for octave", i);

  if (!simplex[i]) simplex[i] = new SimplexNoise();

  if (!NOISE.FIELD.has(simplex[i])) NOISE.FIELD.set(simplex[i], new Map());

  [NOISE.OFFSET.x, NOISE.OFFSET.y] = [0, 0];

  for (let x = 0; x < CANVAS.WIDTH; x++) {
    // if (NOISE.FIELD.get(simplex[i]).has(x)) continue;

    if (!NOISE.FIELD.has(simplex[i])) NOISE.FIELD.set(simplex[i], new Map());

    NOISE.OFFSET.y = 0;
    for (let y = 0; y < CANVAS.HEIGHT; y++) {
      // if (NOISE.FIELD.get(simplex[i]).get(x)[y]) continue;
      let n = noise(p, simplex[i], NOISE.OFFSET);
      NOISE.FIELD.get(simplex[i]).get(x)[y] = n;
      NOISE.OFFSET.y += NOISE.INCREMENT.y * (i + 1);
    }
    NOISE.OFFSET.x += NOISE.INCREMENT.x * (i + 1);
  }
}

export function redrawNoise(p: p5) {
  console.log("redrawing noise");
  if (simplex.length < NOISE.OCTAVES.value()) {
    for (let i = 0; i < NOISE.OCTAVES.value(); i++) {
      if (simplex[i]) continue;
      simplex[i] = new SimplexNoise();
    }
  }

  for (let i = 0; i < NOISE.OCTAVES.value(); i++) {
    redrawOctaveSync(p, i);
  }

  // for (let i = 0; i < NOISE.OCTAVES.value(); i++) {
  //   [NOISE.OFFSET.x, NOISE.OFFSET.y] = [0, 0];

  //   for (let x = 0; x < CANVAS.WIDTH; x++) {
  //     if (!NOISE.FIELD.get(simplex[i]).has(x))
  //       NOISE.FIELD.get(simplex[i]).set(x, []);

  //     NOISE.OFFSET.y = 0;
  //     for (let y = 0; y < CANVAS.HEIGHT; y++) {
  //       let n = noise(p, simplex[i], NOISE.OFFSET);
  //       NOISE.FIELD.get(simplex[i]).get(x)[y] = n;
  //       NOISE.OFFSET.y += NOISE.INCREMENT.y * (i + 1);
  //     }
  //     NOISE.OFFSET.x += NOISE.INCREMENT.x * (i + 1);
  //   }
  // }
}

export function showNoise(p, draw_mode = DRAW_MODES.PIXELS) {
  [NOISE.OFFSET.x, NOISE.OFFSET.y] = [0, 0];

  switch (draw_mode) {
    case DRAW_MODES.PIXELS:
      // console.log("drawing hires pixel image");
      p.loadPixels();
      for (let x = 0; x < CANVAS.WIDTH; x++) {
        NOISE.OFFSET.y = 0;
        for (let y = 0; y < CANVAS.HEIGHT; y++) {
          let n = 0;

          for (let i = 0; i < NOISE.OCTAVES.value(); i++) {
            n += NOISE.FIELD.get(simplex[i]).get(x)[y];
          }

          n /= Number(NOISE.OCTAVES.value());

          let hue = p.map(
            n * Math.sqrt(Number(NOISE.OCTAVES.value())),
            NOISE.MODES.SIMPLEX.MIN,
            NOISE.MODES.SIMPLEX.MAX,
            0,
            360
          );

          // console.log(Math.sin(n) * 360);
          let c = p.color(
            hue + COLOR.PHASE_SHIFT.value() > 360
              ? hue + COLOR.PHASE_SHIFT.value() - 360
              : hue + COLOR.PHASE_SHIFT.value(),
            50,
            65,
            // 1
            p.abs(
              p.map(
                n * Math.sqrt(Number(NOISE.OCTAVES.value())),
                NOISE.MODES.SIMPLEX.MIN,
                NOISE.MODES.SIMPLEX.MAX,
                -1,
                1
              )
            )
          );
          // let c = p.color(
          //   0,
          //   0,
          //   p.map(n, noise_mode.MIN, noise_mode.MAX, 0, 100)
          //   // p.abs(p.map(n, noise_mode.MIN, noise_mode.MAX, -1, 1))
          // );

          p.set(x, y, c);

          NOISE.OFFSET.y += NOISE.INCREMENT.y;
        }
        NOISE.OFFSET.x += NOISE.INCREMENT.x;
      }
      p.updatePixels();
      break;
    case DRAW_MODES.RECTANGLES:
      // console.log("drawing reduced resolution mosaic");

      for (let x = 0; x < CANVAS.COLUMNS; x++) {
        NOISE.OFFSET.y = 0;
        for (let y = 0; y < CANVAS.ROWS; y++) {
          let n = 0;

          for (let i = 0; i < NOISE.OCTAVES.value(); i++) {
            n += NOISE.FIELD.get(simplex[i]).get(
              Math.floor(x * CANVAS.RESOLUTION())
            )[Math.floor(y * CANVAS.RESOLUTION())];
          }

          n /= Number(NOISE.OCTAVES.value());
          let hue = p.map(
            n * Math.sqrt(Number(NOISE.OCTAVES.value())),
            NOISE.MODES.SIMPLEX.MIN,
            NOISE.MODES.SIMPLEX.MAX,
            0,
            360
          );

          // console.log(Math.sin(n) * 360);
          let c = p.color(
            hue + COLOR.PHASE_SHIFT.value() > 360
              ? hue + COLOR.PHASE_SHIFT.value() - 360
              : hue + COLOR.PHASE_SHIFT.value(),
            50,
            65,
            // 1
            p.abs(
              p.map(
                n * Math.sqrt(Number(NOISE.OCTAVES.value())),
                NOISE.MODES.SIMPLEX.MIN,
                NOISE.MODES.SIMPLEX.MAX,
                -1,
                1
              )
            )
          );
          // let c = p.color(
          //   0,
          //   0,
          //   p.map(n, noise_mode.MIN, noise_mode.MAX, 0, 100)
          //   // p.abs(p.map(n, noise_mode.MIN, noise_mode.MAX, -1, 1))
          // );

          p.fill(c);

          p.rect(
            x * CANVAS.RESOLUTION(),
            y * CANVAS.RESOLUTION(),
            1 * CANVAS.RESOLUTION(),
            1 * CANVAS.RESOLUTION()
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
export function showField(p) {
  [NOISE.OFFSET.x, NOISE.OFFSET.y] = [0, 0];
  NOISE.INCREMENT.div(CANVAS.PIXEL_RATIO);

  for (let x = 0; x < CANVAS.COLUMNS; x++) {
    NOISE.OFFSET.y = 0;
    for (let y = 0; y < CANVAS.ROWS; y++) {
      let n = 0;

      for (let i = 0; i < NOISE.OCTAVES.value(); i++) {
        n += NOISE.FIELD.get(simplex[i]).get(
          Math.floor(x * CANVAS.RESOLUTION())
        )[Math.floor(y * CANVAS.RESOLUTION())];
      }

      n /= Number(NOISE.OCTAVES.value());
      let angle = n * Math.sqrt(Number(NOISE.OCTAVES.value())) * p.TWO_PI * 2;

      let vector = p5.Vector.fromAngle(angle);
      vector.setMag(
        p.abs(
          CANVAS.RESOLUTION() * n * Math.sqrt(Number(NOISE.OCTAVES.value()))
        )
      );

      p.push();
      p.translate(
        x * CANVAS.RESOLUTION() + 0.5 * CANVAS.RESOLUTION(),
        y * CANVAS.RESOLUTION() + 0.5 * CANVAS.RESOLUTION()
      );
      p.rotate(vector.heading());
      p.line(0, 0, vector.mag(), 0);
      p.pop();

      NOISE.OFFSET.y += NOISE.INCREMENT.y;
    }
    NOISE.OFFSET.x += NOISE.INCREMENT.x;
  }

  NOISE.INCREMENT.mult(CANVAS.PIXEL_RATIO);
}

export async function evolveNoise(p: p5) {
  for (let i = 0; i < NOISE.OCTAVES.value(); i++) {
    if (!NOISE.FIELD.has(simplex[i])) NOISE.FIELD.set(simplex[i], new Map());

    [NOISE.OFFSET.x, NOISE.OFFSET.y] = [0, 0];

    for (let x = 0; x < CANVAS.COLUMNS; x++) {
      if (!NOISE.FIELD.get(simplex[i]).has(x * CANVAS.RESOLUTION()))
        NOISE.FIELD.get(simplex[i]).set(x * CANVAS.RESOLUTION(), []);

      NOISE.OFFSET.y = 0;
      for (let y = 0; y < CANVAS.ROWS; y++) {
        let n = noise(p, simplex[i], NOISE.OFFSET);
        NOISE.FIELD.get(simplex[i]).get(x * CANVAS.RESOLUTION())[
          y * CANVAS.RESOLUTION()
        ] = n;
        NOISE.OFFSET.y += CANVAS.RESOLUTION() * NOISE.INCREMENT.y * (i + 1);
      }
      NOISE.OFFSET.x += CANVAS.RESOLUTION() * NOISE.INCREMENT.x * (i + 1);
    }
  }

  let acc = 1 + (EVOLUTION.STATE ? 0.1 : -1e-27);

  NOISE.INCREMENT.z < EVOLUTION.MAX * 0.1
    ? EVOLUTION.STATE
      ? (NOISE.INCREMENT.z = EVOLUTION.MAX * 0.1)
      : NOISE.INCREMENT.z < EVOLUTION.MIN
      ? (NOISE.INCREMENT.z = 0)
      : null
    : null;
  NOISE.INCREMENT.z *= NOISE.INCREMENT.z < EVOLUTION.MAX ? acc : 1;

  NOISE.OFFSET.z += NOISE.INCREMENT.z;
  if (!EVOLUTION.STATE) NOISE.INCREMENT.z *= 0.9;
  else CANVAS.REDRAW = true;

  if (NOISE.INCREMENT.z > EVOLUTION.MIN)
    setTimeout(() => evolveNoise(p), 1000 * CANVAS.FRAMERATE ** -1);
  else {
    if (CANVAS.REDRAW) {
      CANVAS.REDRAW = false;
      CANVAS.RESOLUTION(CANVAS.BASE_RESOLUTION);
      redrawNoise(p);
      showNoise(p, DRAW_MODES.PIXELS);
    }
  }
}
