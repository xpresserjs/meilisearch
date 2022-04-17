/**
 * This command installs Meilisearch.
 */
import {execSync} from "child_process"
import {DollarSign} from "xpresser/types";
import {PluginConfig} from "../types";

export = async (args: string[], {helper}: { helper: { $: DollarSign } }) => {
    const $ = helper.$;
    const mei = $.config.newInstanceFrom<PluginConfig>('meilisearch');

    // Get path to Meilisearch
    const pathToBinary = mei.get('pathToBinary');
    $.file.makeDirIfNotExist(pathToBinary);

    // compose command
    const command = `cd ${pathToBinary} && curl -L https://install.meilisearch.com | sh`;

    // call command using child_process
    execSync(command, {stdio: 'inherit'});

    // Log Success
    $.logSuccess(`Meilisearch installed @ ${pathToBinary}`);

    // Exit
    $.exit();
}