//string.format
String.prototype.format = function () {
    let formatted = this;
    for (let i = 0; i < arguments.length; i++) {
        let regexp = new RegExp("\\{" + i + "\\}", "gi");
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

//command lookup
const commonLookup = {
    actlist: {
        copySelectedPuretext: "3",
        copySelectedHtmltext: "4",
        copyLinkName: "1",
        copyLinkUrl: "2",
        copySelectedUrls: "5",
        openSelectedUrls: "6",
        copySelectedImageUrls: "11",
        showSelectedImages: "12",
        copyPagePuretext: "7",
        copyPageHtmltext: "8",
        copyPageUrls: "9",
        openPageUrls: "10",
        copyPageImageUrls: "13",
        showPageImages: "14",
        copyTabName: "15",
        copyTabUrl: "16",
        copyImageUrl: "17",
        showImage: "20",
        copyLinkFormatText: "18",
        copyTabFormatText: "19",
        toolbarButtonAction: "A",
        keyboardShortcutAction: "B"
    },
    defaultTltSetting: {
        openPagesLimit: 5,
        linkCustomFormat: "Name:[[name]][[n]]Url:[[url]]",
        tabCustomFormat: "Name:[[name]][[n]]Url:[[url]]",
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
        htmltextFormatWithoutTag: false
    },
    getUserTltSetting() {
        return browser.storage.local.get({
            userTltSetting: commonLookup.defaultTltSetting
        });
    }
}