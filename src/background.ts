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
                respond("Downloaded zip, imagine receiving a preview here");
        });
}

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
    readSketch(msg, respond);
    return true;
});
