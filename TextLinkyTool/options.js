//Declarations
let defaultTltSetting = { "openPagesLimit":10 };

//i18n message support for page elements
let eles = Array.from(document.querySelectorAll('[data-i18n-msg]'));
eles.forEach(tag => { tag.textContent = browser.i18n.getMessage(tag.getAttribute('data-i18n-msg')); });

//set open pages limit
function setOpenPagesLimit(e) {
    browser.storage.local.set({"userTltSetting":{"openPagesLimit":document.querySelector("#inpOpenPagesLimit").value}});
    document.querySelector("#lblSaved").style.visibility="visible";
    e.preventDefault();
}

//get open pages limit
function getOpenPagesLimit() {    
    browser.storage.local.get("userTltSetting").then((tlt)=>{
        if ((typeof tlt === 'undefined') || (tlt === null)) { tlt={}; }
        if ((typeof tlt["userTltSetting"] === 'undefined') || (tlt["userTltSetting"] === null)){ tlt["userTltSetting"]=defaultTltSetting; }

        document.querySelector("#inpOpenPagesLimit").value = tlt.userTltSetting.openPagesLimit;
    });
}

//page listener
document.addEventListener('DOMContentLoaded', getOpenPagesLimit);
document.querySelector("form").addEventListener("submit", setOpenPagesLimit)
document.querySelector("form input").addEventListener("change",()=>{document.querySelector("#lblSaved").style.visibility="hidden";});