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
    });
}

//set option settings
function setOptionSettings(e) {
    let tlt={"openPagesLimit":document.querySelector("#inpOpenPagesLimit").value
            ,"linkCustomFormat":document.querySelector("#inpLinkCustomFormat").value
            ,"tabCustomFormat":document.querySelector("#inpTabCustomFormat").value
            ,"toolbarButtonAction":document.querySelector("#selToolbarButtonAction").value};
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