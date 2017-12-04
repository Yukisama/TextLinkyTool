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
            txt = txt.replace(new RegExp(/^\s*|\s*$/g), "");
        }
        if (tlt.userTltSetting.puretextFormat.delInvisibleSpace === true) {
            txt = txt.replace(new RegExp(/[\r\f\v]/g), "");
        }
        if (tlt.userTltSetting.puretextFormat.convertQuotation === true) {
            txt = txt.replace(new RegExp(/[“”〝〞„〃]/g), '"');
        }
        if (tlt.userTltSetting.puretextFormat.convertApostrophe === true) {
            txt = txt.replace(new RegExp(/[‵′‘’]/g), "'");
        }
        if (tlt.userTltSetting.puretextFormat.convertDash === true) {
            txt = txt.replace(new RegExp(/[╴－─‒–—―]/g), "-");
        }
        if (tlt.userTltSetting.puretextFormat.convertSpace === true) {
            txt = txt.replace(new RegExp(/[　]/g), " ");
        }
        if (tlt.userTltSetting.puretextFormat.mergeNewline === true) {
            txt = txt.replace(new RegExp(/[\r]+/g), "").replace(new RegExp(/\s*\n\s*\n\s*/g), "\n");
        }
        if (tlt.userTltSetting.puretextFormat.mergeSpace === true) {
            txt = txt.replace(new RegExp(/[ ]+/g), " ");
        }
        if (tlt.userTltSetting.puretextFormat.mergeFullwidthSpace === true) {
            txt = txt.replace(new RegExp(/[　]+/g), "　");
        }
        if (tlt.userTltSetting.puretextFormat.mergeTabulation === true) {
            txt = txt.replace(new RegExp(/[\t]+/g), "\t");
        }
        if (tlt.userTltSetting.puretextFormat.mergeAllTypeSpace === true) {
            txt = txt.replace(new RegExp(/[\r\f\v]/g), "").replace(new RegExp(/[ 　\t]+/g), " ");
        }
        copyToClipboard(txt);
    });
}

//copy selected context to HTML text
function copySelectedHtmlText() {
    commonLookup.getUserTltSetting().then((tlt) => {
        let txt = getSelectedObject().innerHTML;
        if (tlt.userTltSetting.htmltextFormatWithoutTag) {
            txt = getSelectedObject().innerText;
        }
        copyToClipboard(txt);
    });
}

//analyze selected context link URLs
function getSelectedUrls(fixquot) {
    let body = getSelectedObject().innerHTML + "\n" + getSelectedText();
    let regex1 = new RegExp(/<img\s+(?:[^>]*?\s+)?src=(["'])(.*?)\1/gi);
    let imglist = body.match(regex1);
    if (imglist === null) {
        imglist = [];
    } else {
        imglist = imglist.map((s) => {
            return s.replace(/<img\s+(?:[^>]*?\s+)?src=(["'])/i, "").replace(new RegExp(/["']$/i), "");
        });
        body = body.replace(regex1, "");
    }
    let regex4 = new RegExp(/background\-image\:\s*url\(((\&quot\;)|\"|\')(.*?)((\&quot\;)|\"|\')\)/gi);
    let cssbglist = body.match(regex4);
    if (cssbglist === null) {
        cssbglist = [];
    } else {
        cssbglist = cssbglist.map((s) => {
            return s.replace(new RegExp(/background\-image\:\ url\(((\&quot\;)|\"|\')/i), "").replace(new RegExp(/((\&quot\;)|\"|\')\)$/i), "");
        });
        body = body.replace(regex4, "");
    }
    let regex5 = new RegExp(/\s+background=[\"\'](.*?)[\"\']/gi);
    let attbglist = body.match(regex5);
    if (attbglist === null) {
        attbglist = [];
    } else {
        attbglist = attbglist.map((s) => {
            return s.replace(new RegExp(/\s+background=[\"\']/i), "").replace(new RegExp(/["']$/i), "");
        });
        body = body.replace(regex5, "");
    }
    let regex2 = new RegExp(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/gi);
    let alist = body.match(regex2);
    if (alist === null) {
        alist = [];
    } else {
        alist = alist.map((s) => {
            return s.replace(/<a\s+(?:[^>]*?\s+)?href=(["'])/i, "").replace(new RegExp(/["']$/i), "");
        });
        body = body.replace(regex2, "");
    }
    let regex3 = new RegExp(/((ftp|https?):\/\/(www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/gi);
    let matches = body.match(regex3);
    if (matches === null) {
        matches = [];
    }
    let a = document.createElement("a");
    let parser = new DOMParser;
    let urls = imglist.concat(cssbglist).concat(attbglist).concat(alist).concat(matches).map((h) => {
        a.href = h;
        let dom = parser.parseFromString("<!doctype html><body>" + (a.protocol + "//" + a.host + a.pathname + a.search + a.hash), "text/html");
        let u = dom.body.textContent;
        if (fixquot === true) {
            u = u.replace(new RegExp(/\"*$/i), "");
        }
        return u;
    }).filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
    return urls;
}

//copy link URLs
function copySelectedUrls() {
    commonLookup.getUserTltSetting().then((tlt) => {
        let i = 0;
        let formatRule = tlt.userTltSetting.urlsCustomFormat.getFormatRule();
        let formatText = '';
        getSelectedUrls(tlt.userTltSetting.fixUrlQuotEnd).forEach((url) => {
            i++;
            formatText += formatRule.format("[[name]]", url, "\n", "\t", i.toString());
        });
        copyToClipboard(formatText);
    });
}

//open link URLs to browser tabs
function openSelectedUrls() {
    commonLookup.getUserTltSetting().then((tlt) => {
        let urls = getSelectedUrls(tlt.userTltSetting.fixUrlQuotEnd);
        let limit = Number(tlt.userTltSetting.openPagesLimit);
        if (urls.length > limit) {
            urls = urls.slice(0, limit);
            alert(browser.i18n.getMessage("tabsLimitAlert").format(tlt.userTltSetting.openPagesLimit));
        }
        browser.runtime.sendMessage({
            cmd: commonLookup.actlist.serverOpenTabs,
            data: urls
        });
    });
}

//filter images URLs
function getSelectedImageUrls(fixquot) {
    let body = getSelectedObject().innerHTML;
    let regex1 = new RegExp(/<img\s+(?:[^>]*?\s+)?src=(["'])(.*?)\1/gi);
    let imglist1 = body.match(regex1);
    if (imglist1 === null) {
        imglist1 = [];
    } else {
        imglist1 = imglist1.map((s) => {
            return s.replace(new RegExp(/<img\s+(?:[^>]*?\s+)?src=(["'])/i), "").replace(new RegExp(/["']$/i), "");
        });
        body = body.replace(regex1, "");
    }
    let regex4 = new RegExp(/background\-image\:\s*url\(((\&quot\;)|\"|\')(.*?)((\&quot\;)|\"|\')\)/gi);
    let cssbglist = body.match(regex4);
    if (cssbglist === null) {
        cssbglist = [];
    } else {
        cssbglist = cssbglist.map((s) => {
            return s.replace(new RegExp(/background\-image\:\ url\(((\&quot\;)|\"|\')/i), "").replace(new RegExp(/((\&quot\;)|\"|\')\)$/i), "");
        });
        body = body.replace(regex4, "");
    }
    let regex5 = new RegExp(/\s+background=[\"\'](.*?)[\"\']/gi);
    let attbglist = body.match(regex5);
    if (attbglist === null) {
        attbglist = [];
    } else {
        attbglist = attbglist.map((s) => {
            return s.replace(new RegExp(/\s+background=[\"\']/i), "").replace(new RegExp(/["']$/i), "");
        });
        body = body.replace(regex5, "");
    }
    let regex = new RegExp(/\.(bmp|gif|jpe?g|png|tif?f|svg|webp)(\?.*)?$/gi);
    let imglist2 = getSelectedUrls(fixquot).filter((value, index, self) => {
        return regex.test(value);
    });
    let a = document.createElement("a");
    let parser = new DOMParser;
    let urls = imglist1.concat(cssbglist).concat(attbglist).concat(imglist2).map((h) => {
        a.href = h;
        let dom = parser.parseFromString("<!doctype html><body>" + (a.protocol + "//" + a.host + a.pathname + a.search + a.hash), "text/html");
        let u = dom.body.textContent;
        if (fixquot === true) {
            u = u.replace(new RegExp(/\"*$/i), "");
        }
        return u;
    }).filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
    return urls;
}

//copy images link URLs
function copySelectedImageUrls() {
    commonLookup.getUserTltSetting().then((tlt) => {
        let i = 0;
        let formatRule = tlt.userTltSetting.imageUrlsCustomFormat.getFormatRule();
        let formatText = '';
        getSelectedImageUrls(tlt.userTltSetting.fixUrlQuotEnd).forEach((url) => {
            i++;
            formatText += formatRule.format("[[name]]", url, "\n", "\t", i.toString());
        });
        copyToClipboard(formatText);
    });
}

//show images
function showSelectedImages() {
    commonLookup.getUserTltSetting().then((tlt) => {
        let urls = getSelectedImageUrls(tlt.userTltSetting.fixUrlQuotEnd);
        browser.runtime.sendMessage({
            cmd: commonLookup.actlist.serverShowImages,
            data: urls
        });
    });
}

//copy link format text
function copyLinkFormatText(name, url) {
    commonLookup.getUserTltSetting().then((tlt) => {
        let formatRule = tlt.userTltSetting.linkCustomFormat.getFormatRule();
        let formatText = formatRule.format(name, url, "\n", "\t", "[[index]]");
        copyToClipboard(formatText);
    });
}

//copy tab format text
function copyTabFormatText(name, url) {
    commonLookup.getUserTltSetting().then((tlt) => {
        let formatRule = tlt.userTltSetting.tabCustomFormat.getFormatRule();
        let formatText = formatRule.format(name, url, "\n", "\t", "[[index]]");
        copyToClipboard(formatText);
    });
}

//toolbar button action
function toolbarButtonAction() {
    commonLookup.getUserTltSetting().then((tlt) => {
        executeCommand({
            cmd: tlt.userTltSetting.toolbarButtonAction
        });
    });
}

//keyboard shortcut action
function keyboardShortcutAction() {
    commonLookup.getUserTltSetting().then((tlt) => {
        executeCommand({
            cmd: tlt.userTltSetting.keyboardShortcutAction
        });
    });
}

//keyboard shortcut action
function copyAllTabsInfo(tabsInfo) {
    commonLookup.getUserTltSetting().then((tlt) => {
        let i = 0;
        let formatRule = tlt.userTltSetting.tabsinfoCustomFormat.getFormatRule();
        let formatText = '';
        tabsInfo.forEach((ti) => {
            i++;
            formatText += formatRule.format(ti.name, ti.url, "\n", "\t", i.toString());
        });
        copyToClipboard(formatText);
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
            copySelectedUrls();
            break;
        case commonLookup.actlist.openPageUrls:
            getTopWindow();
        case commonLookup.actlist.openSelectedUrls:
            openSelectedUrls();
            break;
        case commonLookup.actlist.copyPageImageUrls:
            getTopWindow();
        case commonLookup.actlist.copySelectedImageUrls:
            copySelectedImageUrls();
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
            copyLinkFormatText(msg.data.name, msg.data.url);
            break;
        case commonLookup.actlist.copyTabFormatText:
            copyTabFormatText(msg.data.name, msg.data.url);
            break;
        case commonLookup.actlist.copyAllTabsInfo:
            copyAllTabsInfo(msg.data);
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