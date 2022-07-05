import p5 from "p5";

const CANVAS = {
  WIDTH: 1024,
  HEIGHT: 1024,
  FRAMERATE: 60,
  RESOLUTION: 4,
  PIXEL_RATIO: 0,
  COLUMNS: 0,
  ROWS: 0,
};

CANVAS.PIXEL_RATIO = CANVAS.RESOLUTION ** -1;

[CANVAS.COLUMNS, CANVAS.ROWS] = [
  Math.floor(CANVAS.WIDTH * CANVAS.PIXEL_RATIO),
  Math.floor(CANVAS.HEIGHT * CANVAS.PIXEL_RATIO),
];

export { CANVAS };

export const PARTICLE_COUNT = 100;

export const DRAW_MODES = {
  PIXELS: Symbol("pixels"),
  RECTANGLES: Symbol("rectangles"),
};
