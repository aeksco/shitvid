// import * as path from "path";
// import { spawn } from "child_process";

async function runUi(options: any) {
  console.log(options);

  // TODO - add cleaner output message here
  console.log("Starting UI...");

  //   // Assembles arguments to start the UI server
  //   let args = ["--cwd", uiPath, "run", "serve"];
  //   const uiProc = spawn("yarn", args);

  //   uiProc.stdout.on("data", (data) => {
  //     console.log(`stdout: ${data}`);
  //   });

  //   uiProc.stderr.on("data", (data) => {
  //     console.log(`stderr: ${data}`);
  //   });

  //   uiProc.on("close", (code) => {
  //     return Promise.resolve();
  //   });
}

export const uiCommand = (...args) => {
  return runUi({ ...args }).catch((err) => {
    // TODO - implement better error handling
    console.log("SHITVID CLI ERROR!!");
    console.log(err);
    if (!process.env.SHITVID_CLI_TEST) {
      process.exit(1);
    }
  });
};
