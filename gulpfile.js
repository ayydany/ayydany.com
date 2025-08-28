const gulp = require("gulp");
const { spawn } = require("child_process");

function spawnHexo(command, args = []) {
  return function (done) {
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

gulp.task("generate-watch", spawnHexo("generate", ["-w"]));
gulp.task("serve", spawnHexo("serve"));

gulp.task("dev", gulp.parallel("generate-watch", "serve"));

gulp.task("generate", spawnHexo("generate"));
gulp.task("deploy", spawnHexo("deploy"));

gulp.task("default", gulp.series("serve"));
