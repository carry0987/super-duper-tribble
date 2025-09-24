import { endGroup, error, startGroup, warning } from '@actions/core';
import runImageTools from '@/tools/imagetools.js';
import { all, get } from '@/inputs.js';
import runFallback from '@/tools/manifest.js';
import { Docker } from '@docker/actions-toolkit/lib/docker/docker.js';
import { Buildx } from '@docker/actions-toolkit/lib/buildx/buildx.js';
import { exit } from 'node:process';

async function main() {
    // Prepare the cache for inputs
    all();

    {
        startGroup('Docker Information');

        await Docker.printVersion();
        await Docker.printInfo();

        endGroup();
    }

    const inputs = get('inputs') || [];
    if (inputs.length === 0) {
        error('Missing a list of input images to merge.');
        exit(1);
    }

    const tags = get('tags') || [];
    const push = get('push') || false;
    const append = get('append') || false;
    const annotations = get('annotations') || [];
    const builder = get('builder');

    // Check if `docker buildx` is avaliable
    const buildx = new Buildx();
    if (!(await buildx.isAvailable())) {
        error(`\`docker buildx\` is not avaliable!`);
        warning('Did you forget to use `docker/setup-buildx-action`?');
        warning('~> Using `docker manifest` as a fallback!');

        return runFallback({ inputs, tags, push, append });
    }

    if (get('fallback')) {
        return runFallback({ inputs, tags, push, append });
    }

    return runImageTools(buildx, {
        inputs,
        tags,
        push,
        append,
        annotations,
        builder
    });
}

main();
