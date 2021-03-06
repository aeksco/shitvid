import * as path from "path";
import { spawn } from "child_process";
import { VideoIteration, VideoScale } from "../types";

// // // //

// FFMPEG notes:
// ffmpeg -i input.mov -vf scale=640:360 output.mp4 -hide_banner
// ffmpeg -i output.mp4 -vf scale=320:180 output_two.mp4 -hide_banner
// ffmpeg -i output_two.mp4 -vf scale=2560:1440 output_three.mp4 -hide_banner
// ffmpeg -i output_three.mp4 -vf scale=320:180 output_four.mp4 -hide_banner
// ffmpeg -i output_four.mp4 -vf scale=2560:1440 output_five.mp4 -hide_banner

/**
 * processVideo
 * Processes a single VideoIteration
 * @param iteration - the VideoIteration that's being processed
 */
export function processVideo(iteration: VideoIteration) {
    console.log(iteration);

    return new Promise((resolve, reject) => {
        let args = [
            "-i",
            iteration.inputFilename,
            "-vf",
            `scale=${iteration.scale}`,
            iteration.outputFilename,
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
        });
    });
}

// // // //

/**
 * buildIterations
 * @param props.limit
 */
export function buildIterations(props: {
    sourceFilepath: string;
    limit: number;
}): VideoIteration[] {
    const { limit } = props;
    let i = 0;

    // Defines array of iterations
    const iterations: VideoIteration[] = [];

    // Procudes an array of VideoIteration instances
    // TODO - add timestamp to iteration filename, derive from sourceFilepath
    const timestamp = Number(new Date());
    while (i < limit) {
        // TODO - use the input filename to make the new filenames here
        let inputFilename =
            "temp/iteration_" + String(i) + `_${timestamp}_` + ".mp4";
        if (i === 0) {
            inputFilename = props.sourceFilepath;
        }

        let outputFilename =
            "temp/iteration_" + String(i + 1) + `_${timestamp}_` + ".mp4";

        let iteration: VideoIteration = {
            number: i,
            inputFilename,
            outputFilename,
            scale: VideoScale.md,
        };

        // Alternate between VideoScale.xs and VideoScale.sm
        if (i % 2 == 0) {
            iteration.scale = VideoScale.sm;
        } else {
            iteration.scale = VideoScale.md;
        }

        // Pushes the iteration into iterations array
        iterations.push(iteration);
        i++;
    }

    // Returns array of iterations
    return iterations;
}

// // // //

async function runShitvid(props: {
    source: string;
    size: VideoScale;
    limit: number;
}) {
    // TODO - add cleaner output message here
    const { limit, source } = props;

    // Defines source filepath
    const sourceFilepath = path.resolve(process.cwd(), source);

    // Get iterations using limit
    // TODO - pass props.source to buildIterations, used to build iteration 0
    const interations: VideoIteration[] = buildIterations({
        sourceFilepath,
        limit,
    });

    // Invoke processVideo for each iteration
    for (const iteration of interations) {
        // console.log(iteration);
        await processVideo(iteration);
    }

    // TODO - log finished message here
    console.log("FINISHED");
}

// // // //

export const shitvidCommand = (
    source: string,
    limit: number,
    options: Record<string, string>
) => {
    return runShitvid({
        source,
        limit,
        size: (options.size as VideoScale) || VideoScale.sm,
    }).catch((err) => {
        // TODO - implement better error handling
        // TODO - implement better error handling
        console.log("SHITVID CLI ERROR!!");
        console.log(err);
        if (!process.env.SHITVID_CLI_TEST) {
            process.exit(1);
        }
    });
};
