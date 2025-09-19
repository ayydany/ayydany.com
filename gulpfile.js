import gulp from "gulp";
import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import { resolve } from "node:path";

function spawnHexo(command, args = []) {
  return (done) => {
    const proc = spawn("hexo", [command, ...args], { stdio: "inherit" });
    proc.on("close", (code) => {
      done(
        code === 0
          ? null
          : new Error(`hexo ${command} exited with code ${code}`)
      );
    });
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

export default gulp.series(serve);
