# sketch-preview

This is a browser plugin (currently only chrome, but firefox support coming soon) to view `.sketch` files on github directly in the browser. Later I will also add visual diffing of those files in pull requests, so you can see what changed in the design directly in the github UI.

Current demo:
![](./demo.gif)


## Using the extension

As song as I am adding features I will not add it to the chrome web store. So for now you can build and use it yourself:

1. Install `pnpm`, the built might work with `npm` too, but I cannot guarantee this.
2. Run `pnpm install`
3. Run `pnpm run build`
4. Go to chrome://extensions and enable developer mode
5. Click on "Load unpacked" and choose this directory
6. You are done


## Acknowledgements

This project was developed during work time at [Futurice](https://futurice.com).
