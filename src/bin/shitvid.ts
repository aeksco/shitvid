#!/usr/bin/env node

// Check node version before requiring/doing anything else
// The user may be on a very old node version
// import minimist from "minimist";
import * as program from "commander";
import chalk from "chalk";
import * as semver from "semver";
import { shitvidCommand } from "../commands/run";
import { CommandOptions } from "../types";

// TODO - pull this from package.json
const requiredVersion = ">=8.9";

// TODO - move into utils module
function checkNodeVersion(wanted, id) {
    if (!semver.satisfies(process.version, wanted)) {
        console.log(
            chalk.red(
                "You are using Node " +
                    process.version +
                    ", but this version of " +
                    id +
                    " requires Node " +
                    wanted +
                    ".\nPlease upgrade your Node version."
            )
        );
        process.exit(1);
    }
}

checkNodeVersion(requiredVersion, "shitvid-cli");

// // // //

// TODO - this should be pulled from package.json
// TODO - this should be pulled from package.json
// TODO - this should be pulled from package.json
program.version("0.1.0").usage("<command> [options]");

// TODO - remove run command, just invoke `shitvid`?
program
    .command("run <source> <limit>")
    .description("runs shitvid")
    // .option('-p, --pizza-type <type>', 'flavour of pizza');
    .option("-sz --size [size]", "The size video file")
    .action((source, limit, cmd) => {
        const options = cleanArgs(cmd);
        // console.log(options);
        shitvidCommand(source, limit, options);
    });

// output help information on unknown commands
program.arguments("<command>").action(cmd => {
    program.outputHelp();
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
    console.log();
});

// add some useful info on help
program.on("--help", () => {
    console.log();
    console.log(
        `  Run ${chalk.cyan(
            `shitvid <command> --help`
        )} for detailed usage of given command.`
    );
    console.log();
});

program.commands.forEach(c => c.on("--help", () => console.log()));

// Parse arguments into commander program
program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

// // // //
// TODO - move into utils module

/**
 * camelize
 * @param str - string that's being camelized
 */
function camelize(str: string): string {
    return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs(cmd): CommandOptions {
    const args = {};
    const options = cmd.options || [];
    // console.log("CMD OPTIPONS");
    // console.log(cmd.options);
    options.forEach(o => {
        const key: string = camelize(o.long.replace(/^--/, ""));
        // if an option is not present and Command has a method with the same name
        // it should not be copied
        if (typeof cmd[key] !== "function" && typeof cmd[key] !== "undefined") {
            args[key] = cmd[key];
        }
    });
    return args;
}
