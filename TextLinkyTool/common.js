//string.format
String.prototype.format = function () {
    let formatted = this;
    for (let i = 0; i < arguments.length; i++) {
        let regexp = new RegExp("\\{" + i + "\\}", "giu");
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

//string.getFormatRule 
String.prototype.getFormatRule = function () {
    let ruletxt = this
        .replace(new RegExp(/\[\[name\]\]/, "giu"), "{0}")
        .replace(new RegExp(/\[\[url\]\]/, "giu"), "{1}")
        .replace(new RegExp(/\[\[n\]\]/, "giu"), "{2}")
        .replace(new RegExp(/\[\[t\]\]/, "giu"), "{3}")
        .replace(new RegExp(/\[\[index\]\]/, "giu"), "{4}")
        .replace(new RegExp(/\[\[potocol\]\]/, "giu"), "{5}")
        .replace(new RegExp(/\[\[host\]\]/, "giu"), "{6}")
        .replace(new RegExp(/\[\[hostname\]\]/, "giu"), "{7}")
        .replace(new RegExp(/\[\[port\]\]/, "giu"), "{8}")
        .replace(new RegExp(/\[\[pathname\]\]/, "giu"), "{9}")
        .replace(new RegExp(/\[\[search\]\]/, "giu"), "{10}")
        .replace(new RegExp(/\[\[hash\]\]/, "giu"), "{11}")
        .replace(new RegExp(/\[\[fullhost\]\]/, "giu"), "{12}")
        .replace(new RegExp(/\[\[fullpath\]\]/, "giu"), "{13}")
    return ruletxt;
};

//element.clearElement
Element.prototype.clearElement = function () {
    let ele = this;
    while (ele.firstChild) { ele.removeChild(ele.firstChild); }
    return ele;
}

//command lookup
const commonLookup = {
    actlist: {
        copySelectedPuretext: "3",
        copySelectedHtmltext: "4",
        copyPagePuretext: "7",
        copyPageHtmltext: "8",
        copyLinkName: "1",
        copyLinkUrl: "2",
        copyLinkFormatText: "18",
        copyTabName: "15",
        copyTabUrl: "16",
        copyTabFormatText: "19",
        copyAllTabsInfo: "21",
        copyImageUrl: "17",
        showImage: "20", 
        copySelectedUrls: "5",
        openSelectedUrls: "6",
        copySelectedImageUrls: "11",
        showSelectedImages: "12",
        copyPageUrls: "9",
        openPageUrls: "10",
        copyPageImageUrls: "13",
        showPageImages: "14", 
        copySelectedAObjectsInfo: "22",
        copyPageAObjectsInfo: "23",
        copySelectedImgObjectsInfo: "24",
        copyPageImgObjectsInfo: "25",
        toolbarButtonAction: "A",
        keyboardShortcutAction: "B",
        serverOpenTabs: "S1",
        serverShowImages: "S2"
    },
    defaultTltSetting: {
        openPagesLimit: 5,
        linkCustomFormatList: [{name:"BBCode Format",data:"[url=[[url]]][[name]][/url]"},{name:"Wiki Syntax",data:"[[[url]] [[name]]]"}],
        tabCustomFormatList: [{name:"BBCode Format",data:"[url=[[url]]][[name]][/url]"},{name:"Wiki Syntax",data:"[[[url]] [[name]]]"}],
        toolbarButtonAction: "12",
        toolbarButtonActionIdx: 0,
        keyboardShortcutAction: "3",
        keyboardShortcutActionIdx: 0,
        fixUrlQuotEnd: true,
        puretextFormat: {
            delAroundSpace: true,
            delInvisibleSpace: true,
            convertQuotation: true,
            convertApostrophe: true,
            convertDash: false,
            convertSpace: false,
            mergeNewline: true,
            mergeSpace: false,
            mergeFullwidthSpace: false,
            mergeTabulation: false,
            mergeAllTypeSpace: false
        },
        htmltextFormatWithoutTag: false,
        openOneImageDirectly: true,
        tabsinfoCustomFormatList: [{name:"Custom",data:"[[index]].[[t]][[url]][[t]]([[name]])[[n]]"}],
        urlsCustomFormatList: [{name:"Custom",data:"[[url]][[n]]"}],
        imageUrlsCustomFormatList: [{name:"Custom",data:"[[url]][[n]]"}],
        aObjectsCustomFormatList: [{name:"Custom",data:"[[url]]([[name]])[[n]]"}],
        imgObjectsCustomFormatList: [{name:"Custom",data:"[[url]]([[name]])[[n]]"}],
        blobUrlToLocal: true,
        locale: "",
        localeData: {}
    },
    getUserTltSetting() {
        return browser.storage.local.get({
            userTltSetting: commonLookup.defaultTltSetting
        });
    },
    getMessage(locale,data,key) {
        if (locale === undefined || locale == "" || data === undefined || data[key] === undefined || data[key]["message"] === undefined ) { return browser.i18n.getMessage(key); }
        return data[key]["message"];
    }
};