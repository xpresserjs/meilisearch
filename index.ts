import {DollarSign} from "xpresser/types";
import type {Index, MeiliSearch} from "meilisearch";
import {namespace} from "./use.json";
import {PluginConfig} from "./types";

/**
 * Use Meilisearch - Gets the Meilisearch instance.
 * @param $
 */
export function useMeilisearch($?: DollarSign) {
    if (!$) $ = require("xpresser").getInstance() as DollarSign;

    if (!$.engineData.has(namespace)) {
        // require meilisearch
        const {MeiliSearch} = require("meilisearch") as typeof import("meilisearch");

        let {config} = $.config.get<PluginConfig>(namespace);
        if (typeof config === "function") config = config();

        // Initialize meilisearch
        const meilisearch = new MeiliSearch(config);

        // save meilisearch instance
        $.engineData.set(namespace, meilisearch);
    }

    return $.engineData.get<MeiliSearch>("meilisearch");
}

type RawSearchModel<T> = {
    // The name of the model.
    name: string;

    // The name of the model's table/index.
    // If not provided, the lower cased name of the model will be used.
    index?: string;

    /**
     * Provide the data to be indexed.
     * @example
     *
     * async data() {
     *     return [
     *         // ... items ...
     *     ]
     * }
     *
     */
    data(index: Index): Promise<T[]>;

    /**
     * Modify/Customize index
     * @param index
     */
    init?(index: Index): Promise<void>;
};

/**
 * Define a search model.
 * @param model
 * @param $
 */
export function defineSearchModel<Data = any>(
    model: RawSearchModel<Data>,
    $?: DollarSign
) {
    // add index to options
    return new SearchModel<Data>(model, $);
}

export class SearchModel<Data = any> {
    model: RawSearchModel<Data>;
    index!: Index;
    initialized: boolean = false;
    readonly #getXpresserFn: () => DollarSign | undefined;


    constructor(model: RawSearchModel<Data>, $?: DollarSign) {
        if (!model.index) model.index = model.name.toLowerCase();
        this.model = model;
        this.#getXpresserFn = () => $;
    }

    async initialize() {
        if (this.initialized) return;

        const m = useMeilisearch(this.#getXpresserFn());

        try {
            await m.createIndex(this.model.index!);
            this.index = m.index(this.model.index!);
        } catch (e) {
            this.index = m.index(this.model.index!);
        }


        // if model has an init function, run it
        if (this.model.init) await this.model.init(this.index);

        // set initialized to true
        this.initialized = true;
    }

    /**
     * Synchronize index with model data
     */
    async syncData() {
        if (!this.initialized) await this.initialize();

        const documents = await this.model.data(this.index);
        const addDocuments = await this.index.addDocuments(documents as Record<string, any>[]);

        return [documents.length, addDocuments];
    }
}
