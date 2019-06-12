import * as JSZip from "jszip";
import * as superagent from "superagent";

const zip = new JSZip();

export type ImageData = { data: number[]; }
export type ImageData2 = { data1: number[]; data2: number[]; };

function readSketch(url: string | [string, string], respond: (a: ImageData | ImageData2) => void): void {
    console.log("fetching " + url);
    if(!Array.isArray(url)) {
        fetchZip(url).then(respond);
    } else {
        Promise.all(url.map(fetchZip))
            .then(([d1, d2]) => ({
                data1: d1.data,
                data2: d2.data
            }))
            .then(respond)
    }
}

function fetchZip(url: string): Promise<ImageData> {
    return superagent
        .get(url.indexOf("?") !== -1 ? url + `&${Math.random()}` : `?${Math.random()}`)
        .accept("application/octet-stream")
        .responseType("arraybuffer")
        .then((res: any) => zip.loadAsync(res.body))
        .then((zip: JSZip) => {
            console.log("zip", zip);
            return getDataFromZip(zip);
        })
}

chrome.runtime.onMessage.addListener((msg, _, respond) => {
    readSketch(msg, respond);
    return true; //Signals async response
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
