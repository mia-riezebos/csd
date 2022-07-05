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
import { CANVAS, COLOR, DRAW_MODES, PARTICLE_COUNT } from "./env";
import noise, {
  NOISE,
  EVOLUTION,
  redrawNoise,
  evolveNoise,
  showNoise,
  showField,
  initNoise,
  initOctave,
} from "./noise";
import Particle from "./particle";

export default (p: p5) => {
  // for higher resolutions switch to MODES.PIXELS
  const drawMode = DRAW_MODES.RECTANGLES;
  const noiseMode = NOISE.MODES.SIMPLEX;

  let noiseDisplay;
  let particlesDisplay;

  let evolveRates = [];
  let rates = [];

  p.setup = function () {
    p.colorMode(p.HSL);

    NOISE.OCTAVES = p.createSlider(1, NOISE.MAX_OCTAVES, 4, 1);

    NOISE.OCTAVES.mousePressed(() => {
      CANVAS.RESOLUTION(CANVAS.BASE_RESOLUTION);
      CANVAS.REDRAW = true;
    }).mouseReleased(() => {
      if (EVOLUTION.STATE) return;
      CANVAS.REDRAW = false;
      CANVAS.RESOLUTION(CANVAS.BASE_RESOLUTION);

      redrawNoise(noiseDisplay);
      showNoise(noiseDisplay, DRAW_MODES.PIXELS);
    });

    p.createCanvas(CANVAS.WIDTH, CANVAS.HEIGHT);

    COLOR.PHASE_SHIFT = p.createSlider(0, 360, 85, 1);

    COLOR.PHASE_SHIFT.mousePressed(() => {
      CANVAS.RESOLUTION(CANVAS.BASE_RESOLUTION);
      CANVAS.REDRAW = true;
    }).mouseReleased(() => {
      if (EVOLUTION.STATE) return;
      CANVAS.REDRAW = false;
      CANVAS.RESOLUTION(CANVAS.BASE_RESOLUTION);

      redrawNoise(noiseDisplay);
      showNoise(noiseDisplay, DRAW_MODES.PIXELS);
    });

    noiseDisplay = p.createGraphics(CANVAS.WIDTH, CANVAS.HEIGHT);
    noiseDisplay.colorMode(p.HSL);
    particlesDisplay = p.createGraphics(CANVAS.WIDTH, CANVAS.HEIGHT);
    particlesDisplay.colorMode(p.HSL);

    initNoise(noiseDisplay);

    p.frameRate(CANVAS.FRAMERATE);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let particle = new Particle(particlesDisplay);
      Particle.particles.push(particle);
      particle.update();
    }

    p.noStroke();
    p.strokeWeight(0);
    showNoise(noiseDisplay, DRAW_MODES.PIXELS);

    p.stroke(255, 10);
    p.strokeWeight(2);
    // showField(p);

    for (let i = 0; i < NOISE.MAX_OCTAVES; i++) {
      setTimeout(() => initOctave(p, i), 100);
    }
  };

  let predraw = function () {};

  p.draw = function () {
    if (p.frameCount === 0) {
      predraw();
    }

    if (rates.length < CANVAS.FRAMERATE) rates.push(p.frameRate());
    else {
      rates.shift();
      rates.push(p.frameRate());
    }

    if (CANVAS.REDRAW) {
      evolveRates.push(p.frameRate());
      if (evolveRates.length > CANVAS.FRAMERATE) evolveRates.shift();
      let average = evolveRates.reduce((a, b) => a + b, 0) / evolveRates.length;
      if (evolveRates.length > 15 && average < 60) {
        CANVAS.RESOLUTION(Math.floor(CANVAS.RESOLUTION() * 2));
        CANVAS.PIXEL_RATIO = CANVAS.RESOLUTION() ** -1;
        [CANVAS.COLUMNS, CANVAS.ROWS] = [
          Math.floor(CANVAS.WIDTH * CANVAS.PIXEL_RATIO),
          Math.floor(CANVAS.HEIGHT * CANVAS.PIXEL_RATIO),
        ];
        evolveRates = [];
      }
    }

    p.background(0, 0, 0);

    if (CANVAS.REDRAW) {
      initNoise(noiseDisplay);

      noiseDisplay.background(0, 0, 0);
      noiseDisplay.noStroke();
      noiseDisplay.strokeWeight(0);
      showNoise(noiseDisplay, drawMode);
    }

    noiseDisplay.stroke(0, 100, 100, 0.2);
    noiseDisplay.strokeWeight(2);
    // showField(noiseDisplay);
    // p.tint(255, 0.5);
    p.image(noiseDisplay, 0, 0);

    Particle.particles.forEach((particle) => {
      particle.show();
      particle.update();
      particle.applyForce();
    });

    // p.tint(255, 1);
    p.image(particlesDisplay, 0, 0);

    showFrameRate();
    // p.noLoop();
  };

  p.windowResized = () => {
    p.resizeCanvas(CANVAS.WIDTH, CANVAS.HEIGHT);
  };

  p.mousePressed = () => {
    if (p.mouseButton == p.RIGHT) return;
    if (
      p.mouseX < 0 ||
      p.mouseX >= CANVAS.WIDTH ||
      p.mouseY < 0 ||
      p.mouseY >= CANVAS.HEIGHT
    )
      return;
    EVOLUTION.STATE = !EVOLUTION.STATE;
    if (EVOLUTION.STATE) {
      console.debug("starting noise evolution, simplifying image");
      evolveNoise(noiseDisplay);
      evolveRates = [];
    } else {
      console.debug("stopping noise evolution...");
    }
  };

  p.keyPressed = () => {
    if (p.key == "n") {
      Particle.particles.push(
        new Particle(p, {
          mass: 10,
          pos: p.createVector(p.mouseX, p.mouseY),
          color: p.color(0, 0, 100, 0.5),
        })
      );
    }
    if (p.key == "p") {
      redrawNoise(noiseDisplay);
      showNoise(noiseDisplay, DRAW_MODES.PIXELS);
    }
  };

  function showFrameRate() {
    p.fill(0);
    p.stroke(255);
    p.strokeWeight(2);
    p.textAlign(p.LEFT, p.TOP);
    p.text(
      `FPS: ${p.floor(p.frameRate())}\nAVG: ${p.floor(
        rates.reduce((a, b) => a + b, 0) / rates.length
      )}`,
      10,
      10
    );
  }
};
