import gulp from "gulp";
import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import { resolve } from "node:path";

function runCommand(command, args = [], options = {}) {
  return new Promise((resolveCommand, reject) => {
    const proc = spawn(command, args, { stdio: "inherit", ...options });
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) {
        resolveCommand();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
  });
}

function spawnHexo(command, args = []) {
  return (done) => {
    runCommand("hexo", [command, ...args])
      .then(() => done())
      .catch((err) => done(err));
  };
}

const artifacts = [".deploy_git", "node_modules", "public", "db.json"];

async function removeArtifacts() {
  for (const target of artifacts) {
    const fullPath = resolve(process.cwd(), target);
    await rm(fullPath, { recursive: true, force: true });
    console.log(`Removed ${target}`);
  }
}

const cleanHexo = spawnHexo("clean");

export const generateWatch = spawnHexo("generate", ["-w"]);
export const serve = spawnHexo("serve");

export const dev = gulp.parallel(generateWatch, serve);

export const generate = spawnHexo("generate");
export const deploy = spawnHexo("deploy");
export const clean = gulp.series(cleanHexo, removeArtifacts);
export const deps = async () => {
  try {
    await runCommand("ncu", ["--version"], { stdio: "ignore" });
  } catch (error) {
    throw new Error(
      "ncu (npm-check-updates) is not installed. Install it globally (`npm install -g npm-check-updates`) or add it locally."
    );
  }

  await runCommand("ncu", ["-u"]);
  await runCommand("npm", ["install"]);
};

export default gulp.series(serve);
