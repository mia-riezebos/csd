import fs from 'fs';
import path from 'path';
/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
  // get a list of sketch directories in the sketches directory

  const sketches = fs
    .readdirSync(path.join(path.resolve(), 'sketches'))
    .filter((file) => fs.statSync(path.join(path.resolve(), 'sketches', file)).isDirectory());

  if (sketches) {
    return {
      status: 200,
      headers: {},
      body: { sketches }
    };
  }

  return {
    status: 404
  };
}
