import pixelmatch = require('pixelmatch');
import { ImageData2 } from './background';
import { getPreviewDiv } from './index';
import { PNG } from 'pngjs';
import { fromByteArray } from 'base64-js';

export function diffViewer(): void {
    const prFiles = Array.from(
        document.querySelectorAll('.file-header[data-file-type=".sketch"]')
    ).map(el => ({
        rawUrl: el!.querySelector<HTMLAnchorElement>(
                        'details-menu a[data-ga-click*="View file"]'
            )!.href + "?raw=true",
        filePath: el!.querySelector('.file-info .link-gray-dark[title]')!.getAttribute('title')
    })).map(({ rawUrl, filePath }) => {
        const repoUrl = rawUrl.substring(0, rawUrl.indexOf("/blob/"));
        return [
            rawUrl,
            `${repoUrl}/blob/master/${filePath}?raw=true`
        ];
    });

    prFiles.forEach(url => {
        const div = getPreviewDiv();
        const img = div.firstChild as Element;

        if(!img || img.tagName !== "IMG")
        {
            console.log(`fetching ${url}`);
            div.innerText = "Loading preview...";
            chrome.runtime.sendMessage(url, displayDiff);
        }
    });

}

function displayDiff(data: ImageData2): void {
    const newImage = PNG.sync.read(Buffer.from(data.data1));
    const oldImage = PNG.sync.read(Buffer.from(data.data2));

    const width = Math.max(newImage.width, oldImage.width);
    const height = Math.max(newImage.height, oldImage.height);

    const diff = new PNG({ width, height });

    const scaledNew = expandImage(newImage, width, height);
    const scaledOld = expandImage(oldImage, width, height);

    pixelmatch(scaledOld, scaledNew, diff.data, width, height);

    let div = getPreviewDiv() as HTMLDivElement;
    if(div) {
        div.innerHTML = `
            <span style="display: block;">Old image:</span>
            <img style="display: block;" src="data:image/png;base64,${fromByteArray(new Uint8Array(data.data2))}"></img>
            <hr />
            <span style="display: block;">New image:</span>
            <img style="display: block;" src="data:image/png;base64,${fromByteArray(new Uint8Array(data.data1))}"></img>
            <hr />
            <span style="display: block;">Difference:</span>
            <img style="display: block;" src="data:image/png;base64,${fromByteArray(PNG.sync.write(diff))}"></img>`;
        div.style.overflowX = "auto";
    }

}

function expandImage(originalImage: PNG, width: number, height: number): Uint8Array {
    // Code copied from https://github.com/reg-viz/img-diff-js/blob/master/lib/expand.js
    if (originalImage.width === width && originalImage.height === height) {
        return originalImage.data;
      }
      const origWidth = originalImage.width;
      const origHeight = originalImage.height;
      const origData = originalImage.data;
      const newData = new Uint8Array(width * height * 4);
      let idx = 0;
      for (let j = 0; j < height; j++) {
        if (j < origHeight) {
          for (let i = 0; i < width; i++) {
            idx = ((j * width) + i) << 2;
            if (i < origWidth) {
              const origIdx = (j * origWidth + i) << 2;
              newData[idx] = origData[origIdx];
              newData[idx + 1] = origData[origIdx + 1];
              newData[idx + 2] = origData[origIdx + 2];
              newData[idx + 3] = origData[origIdx + 3];
            }
          }
        }
      }
    return newData;
}
