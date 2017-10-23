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
    commonLookup.getUserTltSetting().then((tlt)=>{
        let txt=getSelectedObject().innerText;
        if (tlt.userTltSetting.puretextFormat.delAroundSpace===true) { txt=txt.replace(new RegExp(/^\s*|\s*$/g), ''); }
        if (tlt.userTltSetting.puretextFormat.delInvisibleSpace===true) { txt=txt.replace(new RegExp(/[\r\f\v]/g), ''); }
        if (tlt.userTltSetting.puretextFormat.convertSpace===true) { txt=txt.replace(new RegExp(/[　]/g), ' '); }
        if (tlt.userTltSetting.puretextFormat.convertDash===true) { txt=txt.replace(new RegExp(/[╴|－|─|‒|–|—|―]/g), '-'); }
        if (tlt.userTltSetting.puretextFormat.convertApostrophe===true) { txt=txt.replace(new RegExp(/[‵|′|‘|’]/g), "'"); }
        if (tlt.userTltSetting.puretextFormat.convertQuotation===true) { txt=txt.replace(new RegExp(/[“|”|〝|〞|„|〃]/g), '"'); }
        //if (tlt.userTltSetting.puretextFormat.mergeNewline===true) { txt=txt.replace(new RegExp(/[\r\n]+/g), '\n').replace(new RegExp(/\s*\n\s*\n\s*/g), '\n'); }
        if (tlt.userTltSetting.puretextFormat.mergeNewline===true) { txt=txt.replace(new RegExp(/[\r\n]+/g), '\n'); }
        if (tlt.userTltSetting.puretextFormat.mergeSpace===true) { txt=txt.replace(new RegExp(/[ ]+/g), ' '); }
        if (tlt.userTltSetting.puretextFormat.mergeFullwidthSpace===true) { txt=txt.replace(new RegExp(/[　]+/g), '　'); }
        if (tlt.userTltSetting.puretextFormat.mergeTabulation===true) { txt=txt.replace(new RegExp(/[\t]+/g), '\t'); }
        if (tlt.userTltSetting.puretextFormat.mergeAllTypeSpace===true) { txt=txt.replace(new RegExp(/[\r\f\v]/g), '').replace(new RegExp(/[ 　\t]+/g), ' '); }
        copyToClipboard(txt);
    });    
}

//copy selected context to HTML text
function copySelectedHtmlText(){
    copyToClipboard(getSelectedObject().innerHTML);
}

//analyze selected context link URLs
function getSelectedUrls(fixquot) {
    let body = getSelectedObject().innerHTML;
    let regex1 = new RegExp(/<img\s+(?:[^>]*?\s+)?src=(["'])(.*?)\1/gi);
    let imglist = body.match(regex1);
    if (imglist===null) { imglist=[]; } else {
        imglist=imglist.map((s)=>{return s.replace(/<img\s+(?:[^>]*?\s+)?src=(["'])/i,'').replace(new RegExp(/["']$/i),'');}); 
        body=body.replace(regex1,'');
    }    
    let regex2 = new RegExp(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/gi);
    let alist = body.match(regex2);
    if (alist===null) { alist=[]; } else { 
        alist=alist.map((s)=>{return s.replace(/<a\s+(?:[^>]*?\s+)?href=(["'])/i,'').replace(new RegExp(/["']$/i),'');});
        body=body.replace(regex2,''); 
    }
    let regex3 = new RegExp(/((ftp|https?):\/\/(www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/gi);    
    let matches = body.match(regex3);
    if (matches===null) { matches=[]; }
    let a = document.createElement("a");
    let parser = new DOMParser;
    let urls = imglist.concat(alist).concat(matches).map((h)=>{
        a.href = h;
        let dom = parser.parseFromString('<!doctype html><body>' + (a.protocol + "//" + a.host + a.pathname + a.search + a.hash),'text/html');
        let u = dom.body.textContent;
        if (fixquot===true) {u=u.replace(new RegExp(/\"*$/i),'');}
        return u;
    }).filter((value, index, self) => { return self.indexOf(value) === index; });
    return urls;
}

//copy link URLs
function copySelectedUrls(){
    commonLookup.getUserTltSetting().then((tlt)=>{
        copyToClipboard(getSelectedUrls(tlt.userTltSetting.fixUrlQuotEnd).join('\n'));
    });
}

//open link URLs to browser tabs
function openSelectedUrls(){
    commonLookup.getUserTltSetting().then((tlt)=>{
	    let urls=getSelectedUrls(tlt.userTltSetting.fixUrlQuotEnd);
        let limit = Number(tlt.userTltSetting.openPagesLimit);
        if (urls.length>limit) { urls=urls.slice(0,limit); alert(browser.i18n.getMessage("tabs_limit_alert").format(tlt.userTltSetting.openPagesLimit));}
        browser.runtime.sendMessage({cmd:'openTabs',data:urls});
    });
}

//filter images URLs
function getSelectedImageUrls(fixquot){  
    let body = getSelectedObject().innerHTML;
    let regex1 = new RegExp(/<img\s+(?:[^>]*?\s+)?src=(["'])(.*?)\1/gi);
    let imglist1 = body.match(regex1);
    if (imglist1===null) { imglist1=[]; } else {
        imglist1=imglist1.map((s)=>{return s.replace(new RegExp(/<img\s+(?:[^>]*?\s+)?src=(["'])/i),'').replace(new RegExp(/["']$/),'');});
    }
    
    let regex = new RegExp(/\.(bmp|gif|jpe?g|png|tif?f|svg|webp)(\?.*)?$/gi);
    let imglist2 = getSelectedUrls(fixquot).filter((value, index, self) => { return regex.test(value); });

    let a = document.createElement("a");
    let parser = new DOMParser;
    let urls = imglist1.concat(imglist2).map((h)=>{
        a.href = h;
        let dom = parser.parseFromString('<!doctype html><body>' + (a.protocol + "//" + a.host + a.pathname + a.search + a.hash),'text/html');
        let u = dom.body.textContent;
        if (fixquot===true) {u=u.replace(new RegExp(/\"*$/i),'');}
        return u;
    }).filter((value, index, self) => { return self.indexOf(value) === index; });
    return urls;
}

//copy images link URLs
function copySelectedImageUrls(){
    commonLookup.getUserTltSetting().then((tlt)=>{
        copyToClipboard(getSelectedImageUrls(tlt.userTltSetting.fixUrlQuotEnd).join('\n'));
    });
}

//show images
function showSelectedImages(){
    commonLookup.getUserTltSetting().then((tlt)=>{
        let urls = getSelectedImageUrls(tlt.userTltSetting.fixUrlQuotEnd);
        browser.runtime.sendMessage({cmd:'showImgs',data:urls});
    });
}

//copy link format text
function copyLinkFormatText(name,url){
    commonLookup.getUserTltSetting().then((tlt)=>{
        let formatRule = tlt.userTltSetting.linkCustomFormat.replace(new RegExp(/\[\[name\]\]/ig),'{0}').replace(new RegExp(/\[\[url\]\]/ig),'{1}').replace(new RegExp(/\[\[n\]\]/ig),'{2}');
        let formatText = formatRule.format(name,url,'\n');
        copyToClipboard(formatText);
    });
}

//copy tab format text
function copyTabFormatText(name,url){
    commonLookup.getUserTltSetting().then((tlt)=>{
        let formatRule = tlt.userTltSetting.tabCustomFormat.replace(new RegExp(/\[\[name\]\]/ig),'{0}').replace(new RegExp(/\[\[url\]\]/ig),'{1}').replace(new RegExp(/\[\[n\]\]/ig),'{2}');
        let formatText = formatRule.format(name,url,'\n');
        copyToClipboard(formatText);
    });
}

//user custom action
function userCustomAction(actid){
    switch (actid) {
        case commonLookup.menuids.copy_page_puretext: case commonLookup.menuids.copy_selected_puretext: copySelectedPureText(); break;
        case commonLookup.menuids.copy_page_htmltext: case commonLookup.menuids.copy_selected_htmltext: copySelectedHtmlText(); break;
        case commonLookup.menuids.copy_page_urls: case commonLookup.menuids.copy_selected_urls: copySelectedUrls(); break;
        case commonLookup.menuids.open_page_urls: case commonLookup.menuids.open_selected_urls: openSelectedUrls(); break;
        case commonLookup.menuids.copy_page_image_urls: case commonLookup.menuids.copy_selected_image_urls: copySelectedImageUrls(); break;
        case commonLookup.menuids.show_page_images: case commonLookup.menuids.show_selected_images: showSelectedImages(); break;
        default: console.log('no use');
    }
}

//toolbar button action
function toolbarButtonAction(){
    commonLookup.getUserTltSetting().then((tlt)=>{
        userCustomAction(tlt.userTltSetting.toolbarButtonAction);
    });
}

//keyboard shortcut action
function keyboardShortcutAction(){
    commonLookup.getUserTltSetting().then((tlt)=>{
        userCustomAction(tlt.userTltSetting.keyboardShortcutAction);
    });
}