//string.format
String.prototype.format = function () {
    let formatted = this;
    for (let i = 0; i < arguments.length; i++) {
        let regexp = new RegExp("\\{" + i + "\\}", "gi");
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

//string.getFormatRule 
String.prototype.getFormatRule = function () {
    let ruletxt = this
        .replace(new RegExp(/\[\[name\]\]/ig), "{0}")
        .replace(new RegExp(/\[\[url\]\]/ig), "{1}")
        .replace(new RegExp(/\[\[n\]\]/ig), "{2}")
        .replace(new RegExp(/\[\[t\]\]/ig), "{3}")
        .replace(new RegExp(/\[\[index\]\]/ig), "{4}");
    return ruletxt;
};

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
        toolbarButtonAction: "A",
        keyboardShortcutAction: "B",
        serverOpenTabs: "S1",
        serverShowImages: "S2"
    },
    defaultTltSetting: {
        openPagesLimit: 5,
        linkCustomFormatList: [{name:"Custom",data:"Name:[[name]][[n]]Url:[[url]]"}],
        tabCustomFormatList: [{name:"Custom",data:"Name:[[name]][[n]]Url:[[url]]"}],
        toolbarButtonAction: "12",
        keyboardShortcutAction: "3",
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
        blobUrlToLocal: true
    },
    getUserTltSetting() {
        return browser.storage.local.get({
            userTltSetting: commonLookup.defaultTltSetting
        });
    }
};