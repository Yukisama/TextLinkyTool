//page ready
function pageReady() {
    //i18n message support for page elements
    let eles = Array.from(document.querySelectorAll("[data-i18n]"));
    eles.forEach(tag => {
        tag.textContent = browser.i18n.getMessage(tag.getAttribute("data-i18n"));
    });

    //get option settings
    commonLookup.getUserTltSetting().then((tlt)=>{showOptionSettings(tlt.userTltSetting);});
}

//show option settings
function showOptionSettings(setting) {
    document.querySelector("#inpOpenPagesLimit").value = setting.openPagesLimit;
    document.querySelector("#inpLinkCustomFormat").value = setting.linkCustomFormat;
    document.querySelector("#inpTabCustomFormat").value = setting.tabCustomFormat;
    document.querySelector("#selToolbarButtonAction").value = setting.toolbarButtonAction;
    document.querySelector("#selKeyboardShortcutAction").value = setting.keyboardShortcutAction;
    document.querySelector("#inpFixUrlQuotEnd").checked = setting.fixUrlQuotEnd;
    document.querySelector("#inpPuretextFormatDelAroundSpace").checked = setting.puretextFormat.delAroundSpace;
    document.querySelector("#inpPuretextFormatDelInvisibleSpace").checked = setting.puretextFormat.delInvisibleSpace;
    document.querySelector("#inpPuretextFormatConvertQuotation").checked = setting.puretextFormat.convertQuotation;
    document.querySelector("#inpPuretextFormatConvertApostrophe").checked = setting.puretextFormat.convertApostrophe;
    document.querySelector("#inpPuretextFormatConvertDash").checked = setting.puretextFormat.convertDash;
    document.querySelector("#inpPuretextFormatConvertSpace").checked = setting.puretextFormat.convertSpace;
    document.querySelector("#inpPuretextFormatMergeNewline").checked = setting.puretextFormat.mergeNewline;
    document.querySelector("#inpPuretextFormatMergeSpace").checked = setting.puretextFormat.mergeSpace;
    document.querySelector("#inpPuretextFormatMergeFullwidthSpace").checked = setting.puretextFormat.mergeFullwidthSpace;
    document.querySelector("#inpPuretextFormatMergeTabulation").checked = setting.puretextFormat.mergeTabulation;
    document.querySelector("#inpPuretextFormatMergeAllTypeSpace").checked = setting.puretextFormat.mergeAllTypeSpace;
    document.querySelector("#inpHtmltextFormatWithoutTag").checked = setting.htmltextFormatWithoutTag;
    document.querySelector("#inpOpenOneImageDirectly").checked = setting.openOneImageDirectly;
    document.querySelector("#inpTabsinfoCustomFormat").value = setting.tabsinfoCustomFormat;
    document.querySelector("#inpUrlsCustomFormat").value = setting.urlsCustomFormat;
    document.querySelector("#inpImageUrlsCustomFormat").value = setting.imageUrlsCustomFormat;
}

//set option settings
function setOptionSettings(e) {
    let tlt = {
        openPagesLimit: document.querySelector("#inpOpenPagesLimit").value,
        linkCustomFormat: document.querySelector("#inpLinkCustomFormat").value,
        tabCustomFormat: document.querySelector("#inpTabCustomFormat").value,
        toolbarButtonAction: document.querySelector("#selToolbarButtonAction").value,
        keyboardShortcutAction: document.querySelector("#selKeyboardShortcutAction").value,
        fixUrlQuotEnd: document.querySelector("#inpFixUrlQuotEnd").checked,
        puretextFormat: {
            delAroundSpace: document.querySelector("#inpPuretextFormatDelAroundSpace").checked,
            delInvisibleSpace: document.querySelector("#inpPuretextFormatDelInvisibleSpace").checked,
            convertQuotation: document.querySelector("#inpPuretextFormatConvertQuotation").checked,
            convertApostrophe: document.querySelector("#inpPuretextFormatConvertApostrophe").checked,
            convertDash: document.querySelector("#inpPuretextFormatConvertDash").checked,
            convertSpace: document.querySelector("#inpPuretextFormatConvertSpace").checked,
            mergeNewline: document.querySelector("#inpPuretextFormatMergeNewline").checked,
            mergeSpace: document.querySelector("#inpPuretextFormatMergeSpace").checked,
            mergeFullwidthSpace: document.querySelector("#inpPuretextFormatMergeFullwidthSpace").checked,
            mergeTabulation: document.querySelector("#inpPuretextFormatMergeTabulation").checked,
            mergeAllTypeSpace: document.querySelector("#inpPuretextFormatMergeAllTypeSpace").checked
        },
        htmltextFormatWithoutTag: document.querySelector("#inpHtmltextFormatWithoutTag").checked,
        openOneImageDirectly: document.querySelector("#inpOpenOneImageDirectly").checked,        
        tabsinfoCustomFormat: document.querySelector("#inpTabsinfoCustomFormat").value,
        urlsCustomFormat: document.querySelector("#inpUrlsCustomFormat").value,
        imageUrlsCustomFormat: document.querySelector("#inpImageUrlsCustomFormat").value
    }
    browser.storage.local.set({
        "userTltSetting": tlt
    });
    document.querySelector("#lblSaved").style.visibility = "visible";
    e.preventDefault();
}

//clear saved message
function clearSavedMessage() {
    document.querySelector("#lblSaved").style.visibility = "hidden";
}

//clear saved message
function resetOptionSettings() {
    clearSavedMessage();
    showOptionSettings(commonLookup.defaultTltSetting);
}

//page listener
document.addEventListener("DOMContentLoaded", pageReady);
document.querySelector("form").addEventListener("submit", setOptionSettings);
document.querySelector("#inpResetSettings").addEventListener("click", resetOptionSettings);
document.querySelectorAll("form input").forEach((e) => e.addEventListener("change", clearSavedMessage));
document.querySelectorAll("form input").forEach((e) => e.addEventListener("keypress", clearSavedMessage));
document.querySelectorAll("select").forEach((e) => e.addEventListener("change", clearSavedMessage));