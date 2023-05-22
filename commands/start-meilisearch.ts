/**
 * This command starts Meilisearch.
 */
import { execSync } from "child_process";
import type { DollarSign } from "xpresser/types";
import type { PluginConfig } from "../types";

export = async (args: string[], { helper }: { helper: { $: DollarSign } }) => {
    // Get xpresser helper
    const $ = helper.$;

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

    // start meilisearch
    execSync(command, { stdio: "inherit", cwd: pathToBinary });
};
