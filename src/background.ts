const JSZip = require("jszip");
const zip = new JSZip();
const superagent = require("superagent");

function readSketch(url: string, respond: (a: any) => void): void {
    console.log("fetching " + url);
    superagent
        .get(url)
        .accept("application/octet-stream")
        .responseType("arraybuffer")
        .then((res: any) => zip.loadAsync(res.body))
        .then((zip: any) => {
            console.log("zip", zip);
            return getDataFromZip(zip);
        }).then(respond);
}

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
    readSketch(msg, respond);
    return true;
});


function getDataFromZip(zip): Promise<string> {
    return new Promise(resolve => {
        zip.forEach((relativePath, zipEntry) => {
            if (relativePath === 'previews/preview.png') {
                zipEntry.async('base64').then(content => resolve("data:image/png;base64," + content))
            }
        });
    });
}
