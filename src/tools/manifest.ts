import { endGroup, info, setOutput, startGroup } from '@actions/core';
import type { Inputs } from '@/inputs';
import { exec } from '@actions/exec';

const createManifestArguments = (
    type: 'create' | 'push',
    base: string,
    images: string[] = [],
    amend = false
): string[] =>
    amend && type === 'create'
        ? ['manifest', type, '--amend', base].concat(images)
        : ['manifest', type, base].concat(images);

export default async function runFallback({
    inputs,
    tags,
    push,
    append
}: Omit<Inputs, 'annotations' | 'builder' | 'fallback'>) {
    let images = [] as string[];

    for (const image of inputs) {
        info(`Creating manifest for image [${image}] with the following images: ${tags.join(', ')}...`);

        {
            const createArgs = createManifestArguments('create', image, tags, append);
            startGroup(`$ docker ${createArgs.join(' ')}`);

            await exec('docker', createArgs);

            endGroup();

            info(`Created manifest for image ${image}!`);
        }

        if (push) {
            info(`Pushing image ${image}...`);

            const pushArgs = createManifestArguments('push', image, [], append);
            startGroup(`$ docker ${pushArgs.join(' ')}`);

            let digest = '';
            await exec('docker', pushArgs, {
                listeners: {
                    stdout: (data: Buffer) => {
                        digest += data.toString();
                    }
                }
            });

            images.push(`${image}@${digest}`);
            endGroup();

            info(`Pushed image ${image} successfully!`);
        }
    }

    setOutput('images', images.join());
}
