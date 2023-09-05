/**
 * This command starts Meilisearch.
 */
import { execSync } from "child_process";
import type { DollarSign } from "xpresser/types";
import type { PluginConfig } from "../types";
import * as fs from "fs";

export = async (args: string[], { helper }: { helper: { $: DollarSign } }) => {
    // Get xpresser helper
    const $ = helper.$;
    const bashOnly = args[0] === "bash";

    // Get meilisearch config
    const mei = $.config.newInstanceFrom<PluginConfig>("meilisearch");

    // Get path to meilisearch
    const pathToBinary = mei.get("pathToBinary");
    $.file.makeDirIfNotExist(pathToBinary);

    // Get CLI arguments
    let cliArgs = mei.get<PluginConfig["cliArgs"]>("cliArgs", []);
    if (typeof cliArgs === "function") cliArgs = cliArgs();

    // compose command
    const command = `./meilisearch ${cliArgs.join(" ")}`;

    // generate a bash script that can be used to start meilisearch
    const bashScript: string[] = ["#!/bin/bash", `cd ${pathToBinary}`, command];

    // Get the path to generated bash script
    const pathToGeneratedBashScript = mei.get("pathToGeneratedBashScript");

    // Write a bash script to file
    fs.writeFileSync(pathToGeneratedBashScript, bashScript.join("\n"));

    // if bashOnly is true, exit here.
    $.logSuccess(`Bash script generated @ ${pathToGeneratedBashScript}`);
    if (bashOnly) return $.exit();

    execSync(command, { stdio: "inherit", cwd: pathToBinary });
};
