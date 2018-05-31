//page ready
function pageReady() {
    commonLookup.getUserTltSetting().then((tlt)=>{
        //i18n message support for page elements
        let eles = Array.from(document.querySelectorAll("[data-i18n]"));
        eles.forEach(tag => {
            tag.textContent = commonLookup.getMessage(tlt.userTltSetting.locale,tlt.userTltSetting.localeData,tag.getAttribute("data-i18n"));
        });

        //get option settings
        showOptionSettings(tlt.userTltSetting);
    });
}

//custom formats list delete
function listDel(list,idx)
{    
    clearSavedMessage();
    list.querySelectorAll(`[data-idx="${idx}"]`).forEach(ele => ele.remove());
}

//custom formats list add
function listAdd(list,name,value,idx)
{
    clearSavedMessage();
    let frag = document.createDocumentFragment();    
    let inpName = document.createElement("input");
    inpName.setAttribute("tpye","text");
    inpName.setAttribute("class","listName");
    inpName.setAttribute("value",name);
    inpName.setAttribute("maxlength","40");
    inpName.setAttribute("data-idx",idx.toString());
    inpName.addEventListener("change", clearSavedMessage);
    inpName.addEventListener("keypress", clearSavedMessage);
    frag.appendChild(inpName);
    let inpData = document.createElement("input");
    inpData.setAttribute("tpye","text");
    inpData.setAttribute("class","listData");
    inpData.setAttribute("value",value);
    inpData.setAttribute("maxlength","200");
    inpData.setAttribute("data-idx",idx.toString());
    inpData.addEventListener("change", clearSavedMessage);
    inpData.addEventListener("keypress", clearSavedMessage);
    frag.appendChild(inpData);
    let inpDel = document.createElement("input");
    inpDel.setAttribute("type","button");
    inpDel.setAttribute("class","btnDel");
    inpDel.setAttribute("value","-");
    inpDel.setAttribute("data-idx",idx.toString());
    inpDel.addEventListener("click",function(e){
        let list = e.target.parentNode;
        let idx = e.target.getAttribute("data-idx");
        listDel(list,idx);
    });
    frag.appendChild(inpDel);
    let br = document.createElement("br");
    br.setAttribute("data-idx",idx.toString());
    frag.appendChild(br);
    list.appendChild(frag);
}

//button add list click event
function btnAddClick(e)
{
    let list = document.getElementById(e.target.getAttribute("data-listid"));
    let name = e.target.getAttribute("data-name");
    let value = e.target.getAttribute("data-value");
    let dels = list.querySelectorAll("input.btnDel");
    let idx = dels.length==0?0:Number(dels[dels.length-1].getAttribute("data-idx")) + 1;
    listAdd(list,name,value,idx);
}

//get custom formats list data
function getListData(list)
{
    let result=[];
    if (list==null) {return result;}
    let names = list.querySelectorAll(".listName[data-idx]");
    let datas = list.querySelectorAll(".listData[data-idx]");
    for (let i=0;i<names.length;i++){
        result.push({"name":names[i].value,"data":datas[i].value});
    }
    return result;
}

//get locale data
async function getlocaleData(lang)
{
    if (lang=="") { return {}; }
    let url = browser.extension.getURL(`_locales/${lang}/messages.json`);
    //let data = await fetch(url).then((res)=>res.json());  //TypeError for this type.
    let res = await fetch(url);
    let data = await res.json();    
    return data;
}

//show option settings
function showOptionSettings(setting) {
    let frag=null; 
    document.querySelector("#inpOpenPagesLimit").value = setting.openPagesLimit;
    frag=document.createDocumentFragment();
    setting.linkCustomFormatList.forEach( function(item,itemidx) { listAdd(frag,item.name,item.data,itemidx); });
    document.querySelector("#divLinkCustomFormat").clearElement().appendChild(frag);
    frag=null;
    frag=document.createDocumentFragment();
    setting.linkCustomFormatList.forEach( function(item,itemidx) { listAdd(frag,item.name,item.data,itemidx); });
    document.querySelector("#divTabCustomFormat").clearElement().appendChild(frag);
    frag=null;
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
    frag=document.createDocumentFragment();
    setting.tabsinfoCustomFormatList.forEach( function(item,itemidx) { listAdd(frag,item.name,item.data,itemidx); });
    document.querySelector("#divTabsinfoCustomFormat").clearElement().appendChild(frag);
    frag=null;
    frag=document.createDocumentFragment();
    setting.urlsCustomFormatList.forEach( function(item,itemidx) { listAdd(frag,item.name,item.data,itemidx); });
    document.querySelector("#divUrlsCustomFormat").clearElement().appendChild(frag);
    frag=null;
    frag=document.createDocumentFragment();
    setting.imageUrlsCustomFormatList.forEach( function(item,itemidx) { listAdd(frag,item.name,item.data,itemidx); });
    document.querySelector("#divImageUrlsCustomFormat").clearElement().appendChild(frag);
    frag=null;
    document.querySelector("#inpBlobUrlToLocal").checked = setting.blobUrlToLocal;
    document.querySelector("#selInterfaceLanguage").value = setting.locale;
}

//set option settings
async function setOptionSettings(e) {
    let ldata = await getlocaleData(document.querySelector("#selInterfaceLanguage").value);
    let tlt = {
        openPagesLimit: document.querySelector("#inpOpenPagesLimit").value,
        linkCustomFormatList: getListData(document.querySelector("#divLinkCustomFormat")),
        tabCustomFormatList: getListData(document.querySelector("#divTabCustomFormat")),
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
        tabsinfoCustomFormatList: getListData(document.querySelector("#divTabsinfoCustomFormat")),
        urlsCustomFormatList: getListData(document.querySelector("#divUrlsCustomFormat")),
        imageUrlsCustomFormatList: getListData(document.querySelector("#divImageUrlsCustomFormat")),
        blobUrlToLocal: document.querySelector("#inpBlobUrlToLocal").checked,
        locale: document.querySelector("#selInterfaceLanguage").value,
        localeData: ldata
    }
    browser.storage.local.set({
        "userTltSetting": tlt
    });
    document.querySelector("#lblSaved").style.visibility = "visible";
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
document.querySelector("#inpSaveSettings").addEventListener("click", setOptionSettings);
document.querySelector("#inpResetSettings").addEventListener("click", resetOptionSettings);
document.querySelectorAll("form input").forEach((e) => e.addEventListener("change", clearSavedMessage));
document.querySelectorAll("form input").forEach((e) => e.addEventListener("keypress", clearSavedMessage));
document.querySelectorAll("select").forEach((e) => e.addEventListener("change", clearSavedMessage));
document.querySelectorAll(".btnAdd").forEach((e) => e.addEventListener("click",btnAddClick));