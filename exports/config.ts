import type {DollarSign} from "xpresser/types";
import type {PluginConfig} from "../types";

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