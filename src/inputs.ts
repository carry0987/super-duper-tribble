import { getInput, type InputOptions } from '@actions/core';
import { Util } from '@docker/actions-toolkit/lib/util';

const truthy = new Set(['true', 'True', 'TRUE']);
const falsy = new Set(['false', 'False', 'FALSE']);

const getBooleanInput = (name: string, def: boolean, options: InputOptions) => {
    const value = getInput(name, options);
    if (!value) return def;
    if (truthy.has(value)) return true;
    if (falsy.has(value)) return false;

    throw new Error(
        `Value of key [${name}] didn't meet the Yaml 1.2 "Core Schema" specification (received: [${value}])`
    );
};

function getArrayInput(input: string, opts: { sep: string; required?: boolean }) {
    return getInput(input, { trimWhitespace: true, required: opts.required })
        .split(opts.sep)
        .filter(Boolean)
        .map((s) => s.trim());
}

export interface Inputs {
    /**
     * A mapping of annotations to annotate the final, merged manifest.
     *
     * View the [`docker buildx imagetools create --annotation`](https://docs.docker.com/reference/cli/docker/buildx/imagetools/create/#annotation)
     * documentation on how to format each annotation.
     */
    annotations: string[];

    /** Sets the `--builder` for the `buildx` command. */
    builder?: string;

    /** Whether if the action should fallback to the `manifest create` command. */
    fallback: boolean;

    /**
     * A list of Docker images that were built from `docker build` to be the inputs
     * into the merged manifests.
     *
     * Optionally, it can be comma-separated to create multiple final images from the
     * given `images`.
     */
    inputs: string[];

    /** A comma-separated list of tags that will be applied into the merged manifest from `inputs`. */
    tags: string[];

    /** Sets the `--append` flag, which will add new sources to existing manifests. */
    append: boolean;

    /** Whether if the action should push the outputs to the Docker registry. */
    push: boolean;
}

const ALL: Map<string, any> = null!;

/**
 * Creates a mapping of all the inputs avaliable.
 *
 * On the first invocation, it will be loaded from the main script. On other invocations,
 * it is cached.
 */
export function all(): Map<string, any> {
    if (ALL !== null) {
        return ALL;
    }

    const map = new Map<keyof Inputs, any>();
    map.set('inputs', getArrayInput('inputs', { sep: ',', required: true }));
    map.set('tags', getArrayInput('tags', { sep: ',', required: true }));
    map.set('annotations', Util.getInputList('annotations', { ignoreComma: true }));
    map.set('builder', getInput('builder', { trimWhitespace: true }));
    map.set('append', getBooleanInput('append', false, { trimWhitespace: true }));
    map.set('push', getBooleanInput('push', false, { trimWhitespace: true }));
    map.set('fallback', getBooleanInput('fallback', false, { trimWhitespace: true }));

    return map;
}

/** Returns a input. */
export function get<K extends keyof Inputs>(key: K): Inputs[K] | undefined {
    return all().get(key) as Inputs[K] | undefined;
}
