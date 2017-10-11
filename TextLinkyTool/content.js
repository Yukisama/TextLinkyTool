//Declarations
let defaultTltSetting = { "openPagesLimit":10
,"linkCustomFormat":"Name:[[name]][[n]]Url:[[url]]"
,"tabCustomFormat":"Name:[[name]][[n]]Url:[[url]]"
,"toolbarButtonAction":"14" };

//string.format
String.prototype.format = function () {
    let formatted = this;
    for (let i = 0; i < arguments.length; i++) {
        let regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

//copy text to clipboard
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

//copy selected context to HTML text
function copySelectedHtmlText(){
    copyToClipboard(getSelectedObject().innerHTML);
}

//analyze selected context link URLs
function getSelectedUrls() {
    let body = getSelectedObject().innerHTML;
    let regex1 = new RegExp(/<img\s+(?:[^>]*?\s+)?src=(["'])(.*?)\1/gi);
    let imglist = body.match(regex1);
    if (imglist===null) { imglist=[]; } else {
        imglist=imglist.map((s)=>{return s.replace(/<img\s+(?:[^>]*?\s+)?src=(["'])/i,'').replace(/["']$/,'');}); 
        body=body.replace(regex1,'');
    }    
    let regex2 = new RegExp(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/gi);
    let alist = body.match(regex2);
    if (alist===null) { alist=[]; } else { 
        alist=alist.map((s)=>{return s.replace(/<a\s+(?:[^>]*?\s+)?href=(["'])/i,'').replace(/["']$/,'');});
        body=body.replace(regex2,''); 
    }
    let regex3 = new RegExp(/((ftp|https?):\/\/(www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/gi);    
    let matches = body.match(regex3);
    if (matches===null) { matches=[]; }
    let a = document.createElement("a");
    let area = document.createElement('textarea');
    let urls = imglist.concat(alist).concat(matches).map((h)=>{
        a.href = h;
        area.innerHTML = (a.protocol+"//"+a.host+a.pathname+a.search+a.hash);
        return area.value;
    }).filter((value, index, self) => { return self.indexOf(value) === index; });
    return urls;
}

//copy link URLs
function copySelectedUrls(){
    copyToClipboard(getSelectedUrls().toString().replace(/\,/gi,'\n'));
}

//open link URLs to browser tabs
function openSelectedUrls(){
	let urls=getSelectedUrls();
    browser.storage.local.get("userTltSetting").then((tlt)=>{
        if ((typeof tlt === 'undefined') || (tlt === null)) { tlt={}; }
        if ((typeof tlt["userTltSetting"] === 'undefined') || (tlt["userTltSetting"] === null)){ tlt["userTltSetting"]=defaultTltSetting; }
        
        let limit = Number(tlt.userTltSetting.openPagesLimit);
        if (urls.length>limit) { urls=urls.slice(0,limit); alert(browser.i18n.getMessage("tabs_limit_alert").format(tlt.userTltSetting.openPagesLimit));}
        browser.runtime.sendMessage({cmd:'openTabs',data:urls});
    });
}

//filter images URLs
function getSelectedImageUrls(){
    let regex = new RegExp(/\.(bmp|gif|jpe?g|png|tif?f|svg|webp)$/gi);
    let urls = getSelectedUrls().filter((value, index, self) => { return regex.test(value); });
    return urls;
}

//copy images link URLs
function copySelectedImageUrls(){
    copyToClipboard(getSelectedImageUrls().toString().replace(/\,/ig,'\n'));
}

//show images
function showSelectedImages(){
    let urls = getSelectedImageUrls();
    browser.runtime.sendMessage({cmd:'showImgs',data:urls});
}

//copy link format text
function copyLinkFormatText(name,url){
    browser.storage.local.get("userTltSetting").then((tlt)=>{
        if ((typeof tlt === 'undefined') || (tlt === null)) { tlt={}; }
        if ((typeof tlt["userTltSetting"] === 'undefined') || (tlt["userTltSetting"] === null)){ tlt["userTltSetting"]=defaultTltSetting; }
        
        let formatRule = tlt.userTltSetting.linkCustomFormat.replace(/\[\[name\]\]/ig,'{0}').replace(/\[\[url\]\]/ig,'{1}').replace(/\[\[n\]\]/ig,'{2}');
        let formatText = formatRule.format(name,url,'\n');
        copyToClipboard(formatText);
    });
}

//copy tab format text
function copyTabFormatText(name,url){
    browser.storage.local.get("userTltSetting").then((tlt)=>{
        if ((typeof tlt === 'undefined') || (tlt === null)) { tlt={}; }
        if ((typeof tlt["userTltSetting"] === 'undefined') || (tlt["userTltSetting"] === null)){ tlt["userTltSetting"]=defaultTltSetting; }
        
        let formatRule = tlt.userTltSetting.tabCustomFormat.replace(/\[\[name\]\]/ig,'{0}').replace(/\[\[url\]\]/ig,'{1}').replace(/\[\[n\]\]/ig,'{2}');
        let formatText = formatRule.format(name,url,'\n');
        copyToClipboard(formatText);
    });
}

//toolbar button action
function toolbarButtonAction(){
    browser.storage.local.get("userTltSetting").then((tlt)=>{
        if ((typeof tlt === 'undefined') || (tlt === null)) { tlt={}; }
        if ((typeof tlt["userTltSetting"] === 'undefined') || (tlt["userTltSetting"] === null)){ tlt["userTltSetting"]=defaultTltSetting; }
       
        switch (tlt.userTltSetting.toolbarButtonAction)
        {
            case "7": copySelectedPureText(); break;
            case "8": copySelectedHtmlText(); break;
            case "9": copySelectedUrls(); break;
            case "10": openSelectedUrls(); break;
            case "13": copySelectedImageUrls(); break;
            case "14": showSelectedImages(); break;
            default: console.log('no use');
        }
    });
}