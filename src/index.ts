import { ImageData } from './background';
import { fromByteArray } from 'base64-js';

const files = Array.from(
    document.querySelectorAll('.file-header[data-file-type=".sketch"]')
)
    .map(
        el =>
            el!.querySelector<HTMLAnchorElement>(
                'details-menu a[data-ga-click*="View file"]'
            )!.href + "?raw=true"
    )
    .forEach(url => {
        console.log(`fetching ${url}`);
        const div = document.querySelector('.data.highlight.empty') as HTMLDivElement;
        div.innerText = "Loading preview...";
        chrome.runtime.sendMessage(url, displayZip);
    });


function displayZip(previewData: ImageData): void {
    const preview = new Uint8Array(previewData.data);
    const div = document.querySelector('.data.highlight.empty') as HTMLDivElement;
    div.innerHTML = `<img src="data:image/png;base64,${fromByteArray(preview)}"></img>`;
    div.style.overflowX = "auto";
}
