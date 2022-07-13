import p5 from "p5";
// import p from "./p";

const CANVAS = {
  REDRAW: false,
  WIDTH: 1024,
  HEIGHT: 1024,
  FRAMERATE: 144,
  BASE_RESOLUTION: 16,
  RESOLUTION: function (r?: number) {
    if (!r) return this.value;
    this.value = r;
    CANVAS.PIXEL_RATIO = this.value ** -1;
    [CANVAS.COLUMNS, CANVAS.ROWS] = [
      Math.floor(CANVAS.WIDTH * CANVAS.PIXEL_RATIO),
      Math.floor(CANVAS.HEIGHT * CANVAS.PIXEL_RATIO),
    ];
  },
  PIXEL_RATIO: 0,
  COLUMNS: 0,
  ROWS: 0,
};

CANVAS.RESOLUTION(CANVAS.BASE_RESOLUTION);

[CANVAS.COLUMNS, CANVAS.ROWS] = [
  Math.floor(CANVAS.WIDTH * CANVAS.PIXEL_RATIO),
  Math.floor(CANVAS.HEIGHT * CANVAS.PIXEL_RATIO),
];

export let COLOR: {
  PHASE_SHIFT: p5.Element;
} = {
  PHASE_SHIFT: null,
};

export { CANVAS };

export const PARTICLE_COUNT = 100;

export const DRAW_MODES = {
  PIXELS: Symbol("pixels"),
  RECTANGLES: Symbol("rectangles"),
};
