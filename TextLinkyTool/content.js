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

//get selected context text
function getSelectedText() {
    let txt = "";
    let selection = window.getSelection();
    if (selection !== null) {
        txt = selection.toString();
    }
    if (txt === "" && document.activeElement.value !== undefined) {
        txt = document.activeElement.value.substring(document.activeElement.selectionStart, document.activeElement.selectionEnd);
    }
    if (txt === "") {
        txt = document.body.innerText;
    }
    return txt;
}

//get selected context objects
function getSelectedObject() {
    let body = document.body;
    let actelement = document.activeElement;
    let selection = window.getSelection();
    if (selection === null || selection.rangeCount === 0 || selection.toString() === "") {
        if (actelement.value === undefined) {
            return body;
        }
        body = document.createElement("div");
        body.appendChild(actelement.cloneNode(true));
    } else {
        body = document.createElement("div");
        body.appendChild(selection.getRangeAt(0).cloneContents().cloneNode(true));
    }
    return body;
}

//copy selected context to pure text
function copySelectedPureText() {
    commonLookup.getUserTltSetting().then((tlt) => {
        let txt = getSelectedText();
        if (tlt.userTltSetting.puretextFormat.delAroundSpace === true) {
            txt = txt.replace(new RegExp(/^\s*|\s*$/,"gu"), "");
        }
        if (tlt.userTltSetting.puretextFormat.delInvisibleSpace === true) {
            txt = txt.replace(new RegExp(/[\r\f\v]/,"gu"), "");
        }
        if (tlt.userTltSetting.puretextFormat.convertQuotation === true) {
            txt = txt.replace(new RegExp(/[“”〝〞„〃]/,"gu"), '"');
        }
        if (tlt.userTltSetting.puretextFormat.convertApostrophe === true) {
            txt = txt.replace(new RegExp(/[‵′‘’]/,"gu"), "'");
        }
        if (tlt.userTltSetting.puretextFormat.convertDash === true) {
            txt = txt.replace(new RegExp(/[╴－─‒–—―]/,"gu"), "-");
        }
        if (tlt.userTltSetting.puretextFormat.convertSpace === true) {
            txt = txt.replace(new RegExp(/[　]/,"gu"), " ");
        }
        if (tlt.userTltSetting.puretextFormat.mergeNewline === true) {
            txt = txt.replace(new RegExp(/[\r]+/,"gu"), "").replace(new RegExp(/\s*\n\s*\n\s*/,"g"), "\n");
        }
        if (tlt.userTltSetting.puretextFormat.mergeSpace === true) {
            txt = txt.replace(new RegExp(/[ ]+/,"gu"), " ");
        }
        if (tlt.userTltSetting.puretextFormat.mergeFullwidthSpace === true) {
            txt = txt.replace(new RegExp(/[　]+/,"gu"), "　");
        }
        if (tlt.userTltSetting.puretextFormat.mergeTabulation === true) {
            txt = txt.replace(new RegExp(/[\t]+/,"gu"), "\t");
        }
        if (tlt.userTltSetting.puretextFormat.mergeAllTypeSpace === true) {
            txt = txt.replace(new RegExp(/[\r\f\v]/,"gu"), "").replace(new RegExp(/[ 　\t]+/,"gu"), " ");
        }
        copyToClipboard(txt);
    });
}

//copy selected context to HTML text
function copySelectedHtmlText() {
    commonLookup.getUserTltSetting().then((tlt) => {
        let txt = "";
        if (!tlt.userTltSetting.htmltextFormatWithoutTag) {            
            txt = getSelectedObject().innerHTML;
        }
        else {
            txt = getSelectedObject().innerText;
        }
        copyToClipboard(txt);
    });
}

//analyze selected context link URLs
function getSelectedUrls(fixquot,blobtolocal) {
    let body = getSelectedObject().innerHTML + "\n" + getSelectedText();
    let regex1 = new RegExp(/<img\s+(?:[^>]*?\s+)?src=(["'])(.*?)\1/,"gi");
    let imglist = body.match(regex1);
    if (imglist === null) {
        imglist = [];
    } else {
        imglist = imglist.map((s) => {
            return s.replace(new RegExp(/<img\s+(?:[^>]*?\s+)?src=(["'])/,"i"), "").replace(new RegExp(/["']$/,"i"), "");
        });
        body = body.replace(regex1, "");
    }
    let regex4 = new RegExp(/background\-image\:\s*url\(((\&quot\;)|\"|\')(.*?)((\&quot\;)|\"|\')\)/,"gi");
    let cssbglist = body.match(regex4);
    if (cssbglist === null) {
        cssbglist = [];
    } else {
        cssbglist = cssbglist.map((s) => {
            return s.replace(new RegExp(/background\-image\:\ url\(((\&quot\;)|\"|\')/,"i"), "").replace(new RegExp(/((\&quot\;)|\"|\')\)$/,"i"), "");
        });
        body = body.replace(regex4, "");
    }
    let regex5 = new RegExp(/\s+background=[\"\'](.*?)[\"\']/,"gi");
    let attbglist = body.match(regex5);
    if (attbglist === null) {
        attbglist = [];
    } else {
        attbglist = attbglist.map((s) => {
            return s.replace(new RegExp(/\s+background=[\"\']/,"i"), "").replace(new RegExp(/["']$/,"i"), "");
        });
        body = body.replace(regex5, "");
    }
    let regex2 = new RegExp(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/,"gi");
    let alist = body.match(regex2);
    if (alist === null) {
        alist = [];
    } else {
        alist = alist.map((s) => {
            return s.replace(new RegExp(/<a\s+(?:[^>]*?\s+)?href=(["'])/,"i"), "").replace(new RegExp(/["']$/,"i"), "");
        });
        body = body.replace(regex2, "");
    }
    let regex3 = new RegExp(/((ftp|https?):\/\/(www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/,"gi");
    let matches = body.match(regex3);
    if (matches === null) {
        matches = [];
    }
    let urls = imglist.concat(cssbglist).concat(attbglist).concat(alist).concat(matches).map((h) => {
        let u = getAbsolutePath(h);
        if (fixquot === true) { u = u.replace(new RegExp(/\"*$/,"i"), ""); }
        return u;
    }).filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
    return urls;
}

//copy link URLs
function copySelectedUrls(idx) {
    commonLookup.getUserTltSetting().then((tlt) => {
        let i = 0;
        let formatRule = tlt.userTltSetting.urlsCustomFormatList[idx].data.getFormatRule();
        let formatText = '';
        getSelectedUrls(tlt.userTltSetting.fixUrlQuotEnd,tlt.userTltSetting.blobUrlToLocal).forEach((url) => {
            i++;
            let u=new URL(url);
            formatText += formatRule.format("[[name]]", url, "\n", "\t", i.toString(),u.protocol,u.host,u.hostname,u.port,u.pathname,u.search,u.hash,u.origin,u.pathname+u.search+u.hash);
        });
        copyToClipboard(formatText);
    });
}

//open link URLs to browser tabs
function openSelectedUrls() {
    commonLookup.getUserTltSetting().then((tlt) => {
        let urls = getSelectedUrls(tlt.userTltSetting.fixUrlQuotEnd,tlt.userTltSetting.blobUrlToLocal);
        let limit = Number(tlt.userTltSetting.openPagesLimit);
        if (urls.length > limit) {
            urls = urls.slice(0, limit);
            alert(commonLookup.getMessage(tlt.userTltSetting.locale,tlt.userTltSetting.localeData,"tabsLimitAlert").format(tlt.userTltSetting.openPagesLimit));
        }
        browser.runtime.sendMessage({
            cmd: commonLookup.actlist.serverOpenTabs,
            data: urls
        });
    });
}

//filter images URLs
function getSelectedImageUrls(fixquot,blobtolocal) {
    let body = getSelectedObject().innerHTML;
    let regex1 = new RegExp(/<img\s+(?:[^>]*?\s+)?src=(["'])(.*?)\1/,"gi");
    let imglist1 = body.match(regex1);
    if (imglist1 === null) {
        imglist1 = [];
    } else {
        imglist1 = imglist1.map((s) => {
            return s.replace(new RegExp(/<img\s+(?:[^>]*?\s+)?src=(["'])/,"i"), "").replace(new RegExp(/["']$/,"i"), "");
        });
        body = body.replace(regex1, "");
    }
    let regex4 = new RegExp(/background\-image\:\s*url\(((\&quot\;)|\"|\')(.*?)((\&quot\;)|\"|\')\)/,"gi");
    let cssbglist = body.match(regex4);
    if (cssbglist === null) {
        cssbglist = [];
    } else {
        cssbglist = cssbglist.map((s) => {
            return s.replace(new RegExp(/background\-image\:\ url\(((\&quot\;)|\"|\')/,"i"), "").replace(new RegExp(/((\&quot\;)|\"|\')\)$/,"i"), "");
        });
        body = body.replace(regex4, "");
    }
    let regex5 = new RegExp(/\s+background=[\"\'](.*?)[\"\']/,"gi");
    let attbglist = body.match(regex5);
    if (attbglist === null) {
        attbglist = [];
    } else {
        attbglist = attbglist.map((s) => {
            return s.replace(new RegExp(/\s+background=[\"\']/,"i"), "").replace(new RegExp(/["']$/,"i"), "");
        });
        body = body.replace(regex5, "");
    }
    let regex = new RegExp(/\.(bmp|gif|jpe?g|png|tif?f|svg|webp)(\?.*)?$/,"gi");
    let imglist2 = getSelectedUrls(fixquot,blobtolocal).filter((value, index, self) => {
        return regex.test(value);
    });
    let urls = imglist1.concat(cssbglist).concat(attbglist).concat(imglist2).map((h) => {
        let u = getAbsolutePath(h);
        if (fixquot === true) { u = u.replace(new RegExp(/\"*$/,"i"), ""); }
        return u;
    }).filter((value, index, self) => {
        return self.indexOf(value) === index;
    });   
    let blobregex = new RegExp(/^blob:/,"i");
    if (blobtolocal === true) {
        urls = urls.map((u)=>{ 
            if (blobregex.test(u)) { u = getImageToLocal(u); }
            return u;
        }).filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    }
    return urls;
}

//get absolute path
const getAbsolutePath = ((href)=>{
    const a = document.createElement("a");
    const parser = new DOMParser;

    return function _getAbsolutePath() {
        a.href = href;        
        if (a.protocol == "blob:" || a.protocol == "data:") { return href; }  
        let dom = parser.parseFromString("<!doctype html><body>" + (a.protocol + "//" + a.host + a.pathname + a.search + a.hash), "text/html");
        return dom.body.textContent;
    }();    
});

//get image to local
const getImageToLocal = ((url) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    return function _getImageToLocal() {
      let img=document.querySelector("img[src='" + url +"']");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      return canvas.toDataURL();
    }();
});

//copy images link URLs
function copySelectedImageUrls(idx) {
    commonLookup.getUserTltSetting().then((tlt) => {
        let i = 0;
        let formatRule = tlt.userTltSetting.imageUrlsCustomFormatList[idx].data.getFormatRule();
        let formatText = '';
        getSelectedImageUrls(tlt.userTltSetting.fixUrlQuotEnd,tlt.userTltSetting.blobUrlToLocal).forEach((url) => {
            i++;
            let u=new URL(url);
            formatText += formatRule.format("[[name]]", url, "\n", "\t", i.toString(),u.protocol,u.host,u.hostname,u.port,u.pathname,u.search,u.hash,u.origin,u.pathname+u.search+u.hash);
        });
        copyToClipboard(formatText);
    });
}

//show images
function showSelectedImages() {
    commonLookup.getUserTltSetting().then((tlt) => {
        let urls = getSelectedImageUrls(tlt.userTltSetting.fixUrlQuotEnd,tlt.userTltSetting.blobUrlToLocal);
        let title = document.title;
        let location = document.location.toString();
        browser.runtime.sendMessage({
            cmd: commonLookup.actlist.serverShowImages,
            data: {"urls":urls,"title":title,"location":location}
        });
    });
}

//copy <a> Objects Info
function copySelectedAObjectsInfo(idx) {
    commonLookup.getUserTltSetting().then((tlt) => {
        let i = 0;
        let formatRule = tlt.userTltSetting.aObjectsCustomFormatList[idx].data.getFormatRule();
        let formatText = '';
        getSelectedObject().querySelectorAll("a").forEach((obj) => {
            i++;
            let u=new URL(obj.href);
            formatText += formatRule.format(obj.innerHTML.toString(), obj.href, "\n", "\t", i.toString(),u.protocol,u.host,u.hostname,u.port,u.pathname,u.search,u.hash,u.origin,u.pathname+u.search+u.hash);
        });
        copyToClipboard(formatText);
    });
}

//copy <img> Objects Info
function copySelectedImgObjectsInfo(idx) {
    commonLookup.getUserTltSetting().then((tlt) => {
        let i = 0;
        let formatRule = tlt.userTltSetting.imgObjectsCustomFormatList[idx].data.getFormatRule();
        let formatText = '';
        getSelectedObject().querySelectorAll("img").forEach((obj) => {
            i++;
            let u=new URL(obj.src);
            formatText += formatRule.format(obj.alt, obj.src, "\n", "\t", i.toString(),u.protocol,u.host,u.hostname,u.port,u.pathname,u.search,u.hash,u.origin,u.pathname+u.search+u.hash);
        });
        copyToClipboard(formatText);
    });
}

//copy link format text
function copyLinkFormatText(name, url, idx) {
    commonLookup.getUserTltSetting().then((tlt) => {
        let formatRule = tlt.userTltSetting.linkCustomFormatList[idx].data.getFormatRule();
        let u=new URL(url);
        let formatText = formatRule.format(name, url, "\n", "\t", "[[index]]",u.protocol,u.host,u.hostname,u.port,u.pathname,u.search,u.hash,u.origin,u.pathname+u.search+u.hash);
        copyToClipboard(formatText);
    });
}

//copy tab format text
function copyTabFormatText(name, url, idx) {
    commonLookup.getUserTltSetting().then((tlt) => {
        let formatRule = tlt.userTltSetting.tabCustomFormatList[idx].data.getFormatRule();
        let u=new URL(url);
        let formatText = formatRule.format(name, url, "\n", "\t", "[[index]]",u.protocol,u.host,u.hostname,u.port,u.pathname,u.search,u.hash,u.origin,u.pathname+u.search+u.hash);
        copyToClipboard(formatText);
    });
}

//copy all tabs info
function copyAllTabsInfo(tabsInfo, idx) {
    commonLookup.getUserTltSetting().then((tlt) => {
        let i = 0;
        let formatRule = tlt.userTltSetting.tabsinfoCustomFormatList[idx].data.getFormatRule();
        let formatText = "";
        tabsInfo.forEach((ti) => {
            i++;
            let u=new URL(ti.url);
            formatText += formatRule.format(ti.name, ti.url, "\n", "\t", i.toString(),u.protocol,u.host,u.hostname,u.port,u.pathname,u.search,u.hash,u.origin,u.pathname+u.search+u.hash);
        });
        copyToClipboard(formatText);
    });
}

//toolbar button action
function toolbarButtonAction() {
    commonLookup.getUserTltSetting().then((tlt) => {
        executeCommand({
            cmd: tlt.userTltSetting.toolbarButtonAction,
            idx: tlt.userTltSetting.toolbarButtonActionIdx 
        });
    });
}


//keyboard shortcut action
function keyboardShortcutAction() {
    commonLookup.getUserTltSetting().then((tlt) => {
        executeCommand({
            cmd: tlt.userTltSetting.keyboardShortcutAction,
            idx: tlt.userTltSetting.keyboardShortcutActionIdx 
        });
    });
}

//execute command
function executeCommand(msg) {
    if (msg.cmd === commonLookup.actlist.serverShowImages) {
        return;
    }
    switch (msg.cmd) {
        case commonLookup.actlist.copyPagePuretext:
            getTopWindow();
        case commonLookup.actlist.copySelectedPuretext:
            copySelectedPureText();
            break;
        case commonLookup.actlist.copyPageHtmltext:
            getTopWindow();
        case commonLookup.actlist.copySelectedHtmltext:        
            copySelectedHtmlText();
            break;
        case commonLookup.actlist.copyPageUrls:
            getTopWindow();
        case commonLookup.actlist.copySelectedUrls:
            copySelectedUrls(msg.idx);
            break;
        case commonLookup.actlist.openPageUrls:
            getTopWindow();
        case commonLookup.actlist.openSelectedUrls:
            openSelectedUrls();
            break;
        case commonLookup.actlist.copyPageImageUrls:
            getTopWindow();
        case commonLookup.actlist.copySelectedImageUrls:
            copySelectedImageUrls(msg.idx);
            break;
        case commonLookup.actlist.showPageImages:
            getTopWindow();
        case commonLookup.actlist.showSelectedImages:
            showSelectedImages();
            break;
        case commonLookup.actlist.copyLinkName:
        case commonLookup.actlist.copyTabName:
            copyToClipboard(msg.data.name);
            break;
        case commonLookup.actlist.copyLinkUrl:
        case commonLookup.actlist.copyTabUrl:
        case commonLookup.actlist.copyImageUrl:
            copyToClipboard(msg.data.url);
            break;
        case commonLookup.actlist.copyLinkFormatText:
            copyLinkFormatText(msg.data.name, msg.data.url, msg.idx);
            break;
        case commonLookup.actlist.copyTabFormatText:
            copyTabFormatText(msg.data.name, msg.data.url, msg.idx);
            break;            
        case commonLookup.actlist.copyPageAObjectsInfo:
            getTopWindow();
        case commonLookup.actlist.copySelectedAObjectsInfo:
            copySelectedAObjectsInfo(msg.idx);
            break;
        case commonLookup.actlist.copyPageImgObjectsInfo:
            getTopWindow();
        case commonLookup.actlist.copySelectedImgObjectsInfo:
            copySelectedImgObjectsInfo(msg.idx);
            break;
        case commonLookup.actlist.copyAllTabsInfo:
            copyAllTabsInfo(msg.data, msg.idx);
            break;
        case commonLookup.actlist.toolbarButtonAction:
            toolbarButtonAction();
            break;
        case commonLookup.actlist.keyboardShortcutAction:
            keyboardShortcutAction();
            break;
        default:
            console.log("no use");
    }
}

//get top window
function getTopWindow()
{  
    let topwindow=window.self;
    while (window.top!=topwindow) { topwindow=window.top; }
    topwindow.document.querySelectorAll("input,textarea").forEach((s)=>{s.blur();});
}

//page listener
browser.runtime.onMessage.addListener(executeCommand);