//page ready
function pageReady() {    
    //i18n message support for page elements
    let eles = Array.from(document.querySelectorAll('[data-i18n-msg]'));
    eles.forEach(tag => { tag.textContent = browser.i18n.getMessage(tag.getAttribute('data-i18n-msg')); });

    //get option settings
    commonLookup.getUserTltSetting().then((tlt) => {
        document.querySelector("#inpOpenPagesLimit").value = tlt.userTltSetting.openPagesLimit;
        document.querySelector("#inpLinkCustomFormat").value = tlt.userTltSetting.linkCustomFormat;
        document.querySelector("#inpTabCustomFormat").value = tlt.userTltSetting.tabCustomFormat;
        document.querySelector("#selToolbarButtonAction").value = tlt.userTltSetting.toolbarButtonAction;
        document.querySelector("#selKeyboardShortcutAction").value = tlt.userTltSetting.keyboardShortcutAction;
        document.querySelector("#inpFixUrlQuotEnd").checked = tlt.userTltSetting.fixUrlQuotEnd;
        document.querySelector("#PuretextFormatDelAroundSpace").checked = tlt.userTltSetting.puretextFormat.delAroundSpace;
        document.querySelector("#PuretextFormatDelInvisibleSpace").checked = tlt.userTltSetting.puretextFormat.delInvisibleSpace;
        document.querySelector("#PuretextFormatConvertSpace").checked = tlt.userTltSetting.puretextFormat.convertSpace;
        document.querySelector("#PuretextFormatConvertDash").checked = tlt.userTltSetting.puretextFormat.convertDash;
        document.querySelector("#PuretextFormatConvertApostrophe").checked = tlt.userTltSetting.puretextFormat.convertApostrophe;
        document.querySelector("#PuretextFormatConvertQuotation").checked = tlt.userTltSetting.puretextFormat.convertQuotation;
        document.querySelector("#inpPuretextFormatMergeNewline").checked = tlt.userTltSetting.puretextFormat.mergeNewline;
        document.querySelector("#inpPuretextFormatMergeSpace").checked = tlt.userTltSetting.puretextFormat.mergeSpace;
        document.querySelector("#inpPuretextFormatMergeFullwidthSpace").checked = tlt.userTltSetting.puretextFormat.mergeFullwidthSpace;
        document.querySelector("#inpPuretextFormatMergeTabulation").checked = tlt.userTltSetting.puretextFormat.mergeTabulation;
        document.querySelector("#inpPuretextFormatMergeAllTypeSpace").checked = tlt.userTltSetting.puretextFormat.mergeAllTypeSpace;
    });
}

//set option settings
function setOptionSettings(e) {
    let tlt={openPagesLimit:document.querySelector("#inpOpenPagesLimit").value,
            linkCustomFormat:document.querySelector("#inpLinkCustomFormat").value,
            tabCustomFormat:document.querySelector("#inpTabCustomFormat").value,
            toolbarButtonAction:document.querySelector("#selToolbarButtonAction").value,
            keyboardShortcutAction:document.querySelector("#selKeyboardShortcutAction").value,
            fixUrlQuotEnd:document.querySelector("#inpFixUrlQuotEnd").checked,
            puretextFormat:{
                delAroundSpace:document.querySelector("#PuretextFormatDelAroundSpace").checked,
                delInvisibleSpace:document.querySelector("#PuretextFormatDelInvisibleSpace").checked,
                convertSpace:document.querySelector("#PuretextFormatConvertSpace").checked,
                convertDash:document.querySelector("#PuretextFormatConvertDash").checked,
                convertApostrophe:document.querySelector("#PuretextFormatConvertApostrophe").checked,
                convertQuotation:document.querySelector("#PuretextFormatConvertQuotation").checked,
                mergeNewline:document.querySelector("#inpPuretextFormatMergeNewline").checked,
                mergeSpace:document.querySelector("#inpPuretextFormatMergeSpace").checked,
                mergeFullwidthSpace:document.querySelector("#inpPuretextFormatMergeFullwidthSpace").checked,
                mergeTabulation:document.querySelector("#inpPuretextFormatMergeTabulation").checked,
                mergeAllTypeSpace:document.querySelector("#inpPuretextFormatMergeAllTypeSpace").checked
            }
        }
    browser.storage.local.set({"userTltSetting":tlt});
    document.querySelector("#lblSaved").style.visibility="visible";
    e.preventDefault();
}

//clear saved message
function clearSavedMessage() {
    document.querySelector("#lblSaved").style.visibility="hidden";
}

//page listener
document.addEventListener('DOMContentLoaded', pageReady);
document.querySelector("form").addEventListener("submit", setOptionSettings);
document.querySelectorAll("form input").forEach((e) => e.addEventListener("change",clearSavedMessage));
document.querySelectorAll("form input").forEach((e) => e.addEventListener("keypress",clearSavedMessage));
document.querySelectorAll("select").forEach((e) => e.addEventListener("change",clearSavedMessage));