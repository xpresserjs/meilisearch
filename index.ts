import {DollarSign} from "xpresser/types";
import type {MeiliSearch} from "meilisearch";
import {namespace} from "./use.json";
import {PluginConfig} from "./types";

export function useMeilisearch($?: DollarSign) {
    if (!$) $ = require('xpresser').getInstance() as DollarSign;

    if (!$.engineData.has(namespace)) {
        // require meilisearch
        const {MeiliSearch} = require("meilisearch") as typeof import("meilisearch");

        const config = $.config.get<PluginConfig>(namespace);

        // Initialize meilisearch
        const meilisearch = new MeiliSearch(config.config);

        // save meilisearch instance
        $.engineData.set(namespace, meilisearch);
    }

    return $.engineData.get<MeiliSearch>('meilisearch');
}