### 🐳 `docker-imagetools-action`

#### *A tiny, simple GitHub Action to link Docker manifests easily*

**docker-imagetools-action** is a simple GitHub action that combines a list of Docker manifests and merges them into one image via the [`docker buildx imagetools`] command.

## Usage

```yaml
on:
  # ...
jobs:
  docker:
    runs-on: ubuntu-latest
    name: my ci job
    steps:
      - uses: carry0987/docker-imagetools-action@master
        with:
          inputs: namespace/image:latest
          images: namespace/image:latest-amd64,namespace:image/latest-arm64
          push: true
```

## Inputs

### `inputs` (array of strings)

A list of Docker images thdocker buildx imagetoolsat were built from `docker build` into the merged manifests.

Optionally, it can be a comma-separated list (i.e, `image/a:latest-amd64,image/b:latest-amd64`) to create multiple final images from the given [`tags`](#tags-array-of-strings).

### `tags` (array of strings)

A comma-separated list of tags that will be applied into the merged manifest from [`inputs`](#inputs-array-of-strings).

### `push` (`boolean`)

Whether if the action should push the outputs to the Docker registry.

### `annotations` (mapping of `label=value`)

A mapping of annotations to annotate the final, merged manifest.

This is the same syntax as the official Docker GitHub actions handles mappings of `label=value`.

View the [`docker buildx imagetools create --annotation`](https://docs.docker.com/reference/cli/docker/buildx/imagetools/create/#annotation) documentation on how to format each annotation.

### `append` (boolean)

Sets the `--append` flag, which will add new sources to existing manifests.

### `builder` (string)

Sets the `--builder` for the `buildx` command.

## License

**docker-manifest-action** is released under the **MIT License**.

[`docker buildx imagetools`]: https://docs.docker.com/reference/cli/docker/buildx/imagetools/create
