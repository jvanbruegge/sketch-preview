import * as JSZip from "jszip";
import * as superagent from "superagent";

const zip = new JSZip();

export type ImageData = { data: number[]; }

function readSketch(url: string, respond: (a: ImageData) => void): void {
    console.log("fetching " + url);
    superagent
        .get(url.indexOf("?") !== -1 ? url + `&${Math.random()}` : `?${Math.random()}`)
        .accept("application/octet-stream")
        .responseType("arraybuffer")
        .then((res: any) => zip.loadAsync(res.body))
        .then((zip: JSZip) => {
            console.log("zip", zip);
            return getDataFromZip(zip);
        }).then(respond);
}

chrome.runtime.onMessage.addListener((msg, _, respond) => {
    readSketch(msg, respond);
    return true;
});


function getDataFromZip(zip: JSZip): Promise<ImageData> {
    return new Promise(resolve => {
        zip.forEach((relativePath, zipEntry) => {
            if (relativePath === 'previews/preview.png') {
                zipEntry.async('array').then(arr => resolve({ data: arr }));
            }
        });
    });
}
