
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
        chrome.runtime.sendMessage(url, displayZip);
    });


function displayZip(zip: any): void {
    console.log(zip);
}
