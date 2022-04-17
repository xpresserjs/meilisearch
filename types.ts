import {Config} from "meilisearch";

export type PluginConfig = {
    // enabled: boolean;
    pathToBinary: string;
    config: Config
    cliArgs: string[];
}