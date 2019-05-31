import { ImageData } from './background';
import { fromByteArray } from 'base64-js';

function checkForSketchFiles(): void {
    const prFiles = Array.from(
        document.querySelectorAll('.file-header[data-file-type=".sketch"]')
    )
        .map(
            el =>
                el!.querySelector<HTMLAnchorElement>(
                    'details-menu a[data-ga-click*="View file"]'
                )!.href + "?raw=true"
        );


    const files = Array.from(document.querySelectorAll('.repository-content a#raw-url[href$=".sketch"]'))
        .map(el => (el as HTMLAnchorElement).href);

    prFiles.concat(files).forEach(url => {
            const div = getPreviewDiv();
            const img = div.firstChild as Element;

            if(!img || img.tagName !== "IMG")
            {
                console.log(`fetching ${url}`);
                div.innerText = "Loading preview...";
                chrome.runtime.sendMessage(url, displayZip);
            } else {
                console.log("skipped update");
            }
        });
}

function displayZip(previewData: ImageData): void {
    const preview = new Uint8Array(previewData.data);
    let div = getPreviewDiv() as HTMLDivElement;
    if(div) {
        div.innerHTML = `<img src="data:image/png;base64,${fromByteArray(preview)}"></img>`;
        div.style.overflowX = "auto";
    }
}

function getPreviewDiv(): HTMLDivElement {
    const div = document.querySelector('.data.highlight.empty') as HTMLDivElement;
    if(!div) {
        return document.querySelector('[itemprop="text"].data') as HTMLDivElement;
    }
    return div;
}

checkForSketchFiles();

// recheck on site change, because github does not use normal navigation
const config = { attributes: true };
const targetNode = document.querySelector("#js-pjax-loader-bar") as Element;
const observer = new MutationObserver(checkForSketchFiles);

observer.observe(targetNode, config);
