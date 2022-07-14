import fs from "fs";
import path from "path";

const sketchPath = path.join(path.resolve(), "/sketches");
const sketches = [];

fs.readdirSync(sketchPath).forEach((file) => {
  if (fs.statSync(path.join(sketchPath, file)).isDirectory()) {
    sketches.push(file);
  }
});

fs.writeFileSync(
  path.join(path.resolve(), "/public/sketches.json"),
  JSON.stringify(sketches)
);