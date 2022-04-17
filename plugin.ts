import {DollarSign, PluginData} from "xpresser/types";
import {loadPluginConfig} from "@xpresser/plugin-tools/src/Config";
import {namespace} from "./use.json";
import {PluginConfig} from "./types";

/**
 * Dependencies
 */
export function dependsOn() {
    return ["meilisearch"]
}

/**
 * Run plugin
 * @param plugin
 * @param $
 */
export function run(plugin: PluginData, $: DollarSign) {

    // if dev show log
    if ($.isNativeCliCommand()) return;

    // load config file.
    const { pluginConfig } = loadPluginConfig<PluginConfig>({
        namespace,
        type: "function",
        configFile: "meilisearch",
        default: require("./exports/config"),
    }, $);


    // set config
    $.config.set('meilisearch', pluginConfig.data);
}
