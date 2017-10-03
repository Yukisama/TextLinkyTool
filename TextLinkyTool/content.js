//copy text to clipboard. This function is modified from "https://github.com/mdn/webextensions-examples/tree/master/context-menu-copy-link-with-types"
function copyToClipboard(text) {
    function oncopy(event) {
        document.removeEventListener("copy", oncopy, true);
        event.stopImmediatePropagation();
        event.preventDefault();
        event.clipboardData.setData("text/plain", text);
    }
    document.addEventListener("copy", oncopy, true);
    document.execCommand("copy");
}

//get selected context
function getSelectedObject() {
    let body = document.body;
    let selection = window.getSelection();
    if (selection.rangeCount === 0 || selection.toString() === '') { return body; }
    body = document.createElement('div');
    body.appendChild(selection.getRangeAt(0).cloneContents().cloneNode(true));
    return body;
}

//copy selected context to pure text
function copySelectedPureText(){
    copyToClipboard(getSelectedObject().innerText);
}

//Copy selected context to HTML text
function copySelectedHtmlText(){
    copyToClipboard(getSelectedObject().innerHTML);
}

//analyze selected context link urls
function getSelectedUrls() {
    let regex = new RegExp(/((ftp|https?):\/\/(www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/gi);
    let body = getSelectedObject().innerHTML;
    let matches = body.match(regex);
    if (matches===null) { matches=[]; }
    let regex2 = new RegExp(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/gi);
    let alist = body.match(regex2).map((s)=>{return s.replace(/<a\s+(?:[^>]*?\s+)?href=(["'])/,'').replace('"','');});
    if (alist===null) { alist=[]; }
    let urls = matches.concat(alist).map((h)=>{
        var link = document.createElement("a");
        link.href = h;
        return (link.protocol+"//"+link.host+link.pathname+link.search+link.hash);
    }).filter((value, index, self) => { return self.indexOf(value) === index; });
    return urls;
}

//copy link urls
function copySelectedUrls(){
    copyToClipboard(getSelectedUrls().toString().replace(/\,/ig,'\n'));
}

//open link urls to browser tabs
function openSelectedUrls(){
	let urls=getSelectedUrls();
    if (urls.length>10) { urls=urls.slice(0,10); alert(browser.i18n.getMessage("tabs_limit_alert")); }
    browser.runtime.sendMessage(urls);
}