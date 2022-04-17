import type {DollarSign} from "xpresser/types";
import {Config} from "meilisearch";


export = ($: DollarSign): PluginConfig => {
    return {
        pathToBinary: $.path.storage('meilisearch/bin'),

        config: {
            host: 'http://127.0.0.1:7700',
        },

        cliArgs: [
            "--no-analytics",
        ],
    }
}


type PluginConfig = {
    pathToBinary: string;
    config: Config | (() => Config);
    cliArgs: string[] | (() => string[]);
};