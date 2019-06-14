# sketch-preview

This is a browser plugin (currently only Chrome, but Firefox support coming soon) to view `.sketch` files on GitHub directly in the browser. Later I will also add visual diffing of those files in pull requests, so you can see what changed in the design directly in the GitHub UI.

## Install the extension

Firefox: You can install it directly from the [Addon Store](https://addons.mozilla.org/en-US/firefox/addon/sketch-preview/)
Chrome: You can find it in the [Chrome web store](https://chrome.google.com/webstore/detail/sketch-preview/dnggldceandgpmohpplipbhnhdhaiehp)

## Demo

![](./demo.gif)

## Developing the extension

As long as I am adding features I will not add it to the Chrome web store. So for now you can build and use it yourself:

1. Install `pnpm`, the build might work with `npm` too, but I cannot guarantee this.
2. Run `pnpm install`
3. Run `pnpm run build`

For Chrome:
1. Go to chrome://extensions and enable developer mode
2. Click on "Load unpacked" and choose this directory

For Firefox:
1. Go to about:debugging#addons
2. Click on "Load temporary addon" and choose "manifest.json" in this directory

## Acknowledgements

This project was developed during work time at [Futurice](https://futurice.com).
