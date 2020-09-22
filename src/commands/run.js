const Promise = require("bluebird");
const { spawn } = require("child_process");

// // // //

function processVideo(iteration) {
  console.log(iteration);

  return new Promise((resolve, reject) => {
    let args = [
      "-i",
      iteration.i,
      "-vf",
      `scale=${iteration.scale}`,
      iteration.o,
      "-hide_banner",
    ];
    const ls = spawn("ffmpeg", args);

    ls.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    ls.stderr.on("data", (data) => {
      console.log(`stderr: ${data}`);
    });

    ls.on("close", (code) => {
      return resolve();
      // console.log(`child process exited with code ${code}`);
    });
  });
}

// ffmpeg -i input.mov -vf scale=640:360 output.mp4 -hide_banner

// ffmpeg -i output.mp4 -vf scale=320:180 output_two.mp4 -hide_banner

// ffmpeg -i output_two.mp4 -vf scale=2560:1440 output_three.mp4 -hide_banner
// ffmpeg -i output_three.mp4 -vf scale=320:180 output_four.mp4 -hide_banner
// ffmpeg -i output_four.mp4 -vf scale=2560:1440 output_five.mp4 -hide_banner

// // // //

let i = 140;
let limit = 500;
let iterations = [];

while (i < limit) {
  let inputFilename = "iteration_" + String(i) + ".mp4";
  let outputFilename = "iteration_" + String(i + 1) + ".mp4";

  let iteration = { i: inputFilename, o: outputFilename };

  if (i % 2 == 0) {
    // iteration.scale = '320:180';
    // iteration.scale = '640:360';
    iteration.scale = "100:360";
  } else {
    // iteration.scale = '2560:1440';
    // iteration.scale = '1280:720';
    iteration.scale = "640:360";
  }

  iterations.push(iteration);
  i++;
}

// // // //

Promise.each(iterations, processVideo).then(() => {
  console.log("DONE");
});
