
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
        const div = document.querySelector('.data.highlight.empty');
        div.innerText = "Loading preview...";
        chrome.runtime.sendMessage(url, displayZip);
    });


function displayZip(zip: any): void {
    const div = document.querySelector('.data.highlight.empty');
    div.innerHTML = `<img src="${zip}"></img>`;
    div.style["overflow-x"] = "auto";
}
