import type { DollarSign } from "xpresser/types";
import { Config } from "meilisearch";

export = ($: DollarSign): PluginConfig => {
    return {
        pathToBinary: $.path.storage("meilisearch/bin"),
        pathToGeneratedBashScript: $.path.storage("meilisearch/start.sh"),

        config: {
            host: "http://127.0.0.1:7700"
        },

        cliArgs: ["--no-analytics"]
    };
};

type PluginConfig = {
    pathToBinary: string;
    pathToGeneratedBashScript: string;
    config: Config | (() => Config);
    cliArgs: string[] | (() => string[]);
};
