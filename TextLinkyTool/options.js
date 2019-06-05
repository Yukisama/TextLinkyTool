//page ready
function pageReady() {
    commonLookup.getUserTltSetting().then((tlt)=>{
        //i18n message support for page elements
        document.querySelectorAll("[data-i18n]").forEach(ele => {
            let ctxt = commonLookup.getMessage(tlt.userTltSetting.locale,tlt.userTltSetting.localeData,ele.getAttribute("data-i18n"));
            switch (ele.tagName){
                case "INPUT":
                    ele.value = ctxt;
                //case "LABEL": case "OPTION": 
                default:
                    ele.textContent = ctxt;
            }            
        });

        //get option settings
        showOptionSettings(tlt.userTltSetting);
    });

    //Tooltips active
    document.querySelectorAll(".tiptxt").forEach((ele)=>{
        let tptxt = ele.cloneNode(true);
        let boxcss = ele.getAttribute("data-boxcss");
        tptxt.attributes.removeNamedItem("data-boxcss");
        document.querySelectorAll(`.tipbox.${boxcss}`).forEach((box)=>{ box.appendChild(tptxt.cloneNode(true)); });
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
        changeToolbarAction();    
        changeKeyboardAction();
    });
    frag.appendChild(inpDel);
    let br = document.createElement("br");
    br.setAttribute("data-idx",idx.toString());
    frag.appendChild(br);
    list.appendChild(frag);
    changeToolbarAction();
    changeKeyboardAction();
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
    let data = await fetch(url).then((res)=>res.json());
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
    setting.tabCustomFormatList.forEach( function(item,itemidx) { listAdd(frag,item.name,item.data,itemidx); });
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
    frag=document.createDocumentFragment();
    setting.aObjectsCustomFormatList.forEach( function(item,itemidx) { listAdd(frag,item.name,item.data,itemidx); });
    document.querySelector("#divAObjectsCustomFormat").clearElement().appendChild(frag);
    frag=null; 
    frag=document.createDocumentFragment();
    setting.imgObjectsCustomFormatList.forEach( function(item,itemidx) { listAdd(frag,item.name,item.data,itemidx); });
    document.querySelector("#divImgObjectsCustomFormat").clearElement().appendChild(frag);
    frag=null;
    document.querySelector("#inpBlobUrlToLocal").checked = setting.blobUrlToLocal;
    document.querySelector("#selInterfaceLanguage").value = setting.locale;
    changeToolbarAction();
    document.querySelector("#selToolbarButtonActionIdx").value = setting.toolbarButtonActionIdx.toString();
    changeKeyboardAction();
    document.querySelector("#selKeyboardShortcutActionIdx").value = setting.keyboardShortcutActionIdx.toString();
}

//set option settings
async function setOptionSettings(e) {
    let ldata = await getlocaleData(document.querySelector("#selInterfaceLanguage").value);
    let tlt = {
        openPagesLimit: document.querySelector("#inpOpenPagesLimit").value,
        linkCustomFormatList: getListData(document.querySelector("#divLinkCustomFormat")),
        tabCustomFormatList: getListData(document.querySelector("#divTabCustomFormat")),
        toolbarButtonAction: document.querySelector("#selToolbarButtonAction").value,
        toolbarButtonActionIdx: document.querySelector("#selToolbarButtonActionIdx").selectedIndex,
        keyboardShortcutAction: document.querySelector("#selKeyboardShortcutAction").value,
        keyboardShortcutActionIdx: document.querySelector("#selKeyboardShortcutActionIdx").selectedIndex,
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
        aObjectsCustomFormatList: getListData(document.querySelector("#divAObjectsCustomFormat")),
        imgObjectsCustomFormatList: getListData(document.querySelector("#divImgObjectsCustomFormat")),
        blobUrlToLocal: document.querySelector("#inpBlobUrlToLocal").checked,
        locale: document.querySelector("#selInterfaceLanguage").value,
        localeData: ldata
    }
    
    //checking settings
    if ((tlt.toolbarButtonAction==commonLookup.actlist.copySelectedUrls && tlt.toolbarButtonActionIdx==-1) ||
        (tlt.keyboardShortcutAction==commonLookup.actlist.copySelectedUrls && tlt.keyboardShortcutActionIdx==-1))
    {
        commonLookup.getUserTltSetting().then((tlt)=>{
            alert(commonLookup.getMessage(tlt.userTltSetting.locale,tlt.userTltSetting.localeData,"actUrlFormatEmpty"));
        });
        return;    
    }
    if ((tlt.toolbarButtonAction==commonLookup.actlist.copySelectedImageUrls && tlt.toolbarButtonActionIdx==-1) ||
        (tlt.keyboardShortcutAction==commonLookup.actlist.copySelectedImageUrls && tlt.keyboardShortcutActionIdx==-1))
    {
        commonLookup.getUserTltSetting().then((tlt)=>{
            alert(commonLookup.getMessage(tlt.userTltSetting.locale,tlt.userTltSetting.localeData,"actImgUrlFormatEmpty"));
        });
        return;
    }

    //save settings
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

//fill ActionIdx list
function fillActionIdx(actqs,selqs){
    let sel=document.querySelector(selqs);
    let list=[];    
    if (document.querySelector(actqs).value==commonLookup.actlist.copySelectedUrls)
    {
        list=getListData(document.querySelector("#divUrlsCustomFormat"));        
    }
    if (document.querySelector(actqs).value==commonLookup.actlist.copySelectedImageUrls)
    {
        list=getListData(document.querySelector("#divImageUrlsCustomFormat"));
    }
    let frag=document.createDocumentFragment();
    list.forEach((item,idx)=>{
        let op = document.createElement("option");
        op.setAttribute("value",idx.toString());
        op.text = (idx+1).toString() + " - " + item.name;
        frag.appendChild(op);
    });    
    sel.querySelectorAll("option").forEach(ele => ele.remove());
    sel.appendChild(frag);
}

//change ToolbarButtonAction
function changeToolbarAction(){
    fillActionIdx("#selToolbarButtonAction","#selToolbarButtonActionIdx");
}

//change KeyboardShortcutAction
function changeKeyboardAction(){
    fillActionIdx("#selKeyboardShortcutAction","#selKeyboardShortcutActionIdx");
}


//page listener
document.addEventListener("DOMContentLoaded", pageReady);
document.querySelector("#inpSaveSettings").addEventListener("click", setOptionSettings);
document.querySelector("#inpResetSettings").addEventListener("click", resetOptionSettings);
document.querySelector("#selToolbarButtonAction").addEventListener("change", changeToolbarAction);
document.querySelector("#divUrlsCustomFormat").addEventListener("focusout",e=> {changeToolbarAction();e.stopPropagation();});
document.querySelector("#selKeyboardShortcutAction").addEventListener("change", changeKeyboardAction);
document.querySelector("#divImageUrlsCustomFormat").addEventListener("focusout",e=> {changeToolbarAction();e.stopPropagation();});
document.querySelectorAll("form input").forEach((e) => e.addEventListener("change", clearSavedMessage));
document.querySelectorAll("form input").forEach((e) => e.addEventListener("keypress", clearSavedMessage));
document.querySelectorAll("select").forEach((e) => e.addEventListener("change", clearSavedMessage));
document.querySelectorAll(".btnAdd").forEach((e) => e.addEventListener("click",btnAddClick));