//Declarations
let defaultTltSetting = { "openPagesLimit":10, "linkCustomFormat":"Name:[[name]][[n]]Url:[[url]]", "tabCustomFormat":"Name:[[name]][[n]]Url:[[url]]" };

//i18n message support for page elements
let eles = Array.from(document.querySelectorAll('[data-i18n-msg]'));
eles.forEach(tag => { tag.textContent = browser.i18n.getMessage(tag.getAttribute('data-i18n-msg')); });

//get option settings
function getOptionSettings() {    
    browser.storage.local.get("userTltSetting").then((tlt)=>{
        if ((typeof tlt === 'undefined') || (tlt === null)) { tlt={}; }
        if ((typeof tlt["userTltSetting"] === 'undefined') || (tlt["userTltSetting"] === null)){ tlt["userTltSetting"]=defaultTltSetting; }

        document.querySelector("#inpOpenPagesLimit").value = tlt.userTltSetting.openPagesLimit;
        document.querySelector("#inpLinkCustomFormat").value = tlt.userTltSetting.linkCustomFormat;
        document.querySelector("#inpTabCustomFormat").value = tlt.userTltSetting.tabCustomFormat;
    });
}

//set option settings
function setOptionSettings(e) {
    let tlt={"openPagesLimit":document.querySelector("#inpOpenPagesLimit").value
            ,"linkCustomFormat":document.querySelector("#inpLinkCustomFormat").value
            ,"tabCustomFormat":document.querySelector("#inpTabCustomFormat").value};
    browser.storage.local.set({"userTltSetting":tlt});
    document.querySelector("#lblSaved").style.visibility="visible";
    e.preventDefault();
}

//clear saved message
function clearSavedMessage() {
    document.querySelector("#lblSaved").style.visibility="hidden";
}

//page listener
document.addEventListener('DOMContentLoaded', getOptionSettings);
document.querySelector("form").addEventListener("submit", setOptionSettings);
document.querySelectorAll("form input").forEach((e) => e.addEventListener("change",clearSavedMessage));
document.querySelectorAll("form input").forEach((e) => e.addEventListener("keypress",clearSavedMessage));