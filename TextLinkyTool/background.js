//Declarations
const menuids={
    copy_selected_puretext:"3",
    copy_selected_htmltext:"4",
    copy_link_name:"1",
    copy_link_url:"2",
    copy_selected_urls:"5",
    open_selected_urls:"6",
    copy_page_puretext:"7",
    copy_page_htmltext:"8",
    copy_page_urls:"9"
    //,open_page_urls:"10"  //disable feature because too danger for memory.
}

//Menus Combine
browser.contextMenus.create({
    id: menuids.copy_selected_puretext,
    title: browser.i18n.getMessage("copy_selected_puretext"),
    contexts: ["selection"]
});
browser.contextMenus.create({
    id: menuids.copy_selected_htmltext,
    title: browser.i18n.getMessage("copy_selected_htmltext"),
    contexts: ["selection"]
});
browser.contextMenus.create({
    contexts: ["link"],
	type:"separator"
});
browser.contextMenus.create({
    id: menuids.copy_link_name,
    title: browser.i18n.getMessage("copy_link_name"),
    contexts: ["link"]
});
browser.contextMenus.create({
    id: menuids.copy_link_url,
    title: browser.i18n.getMessage("copy_link_url"),
    contexts: ["link"]
});
browser.contextMenus.create({
    contexts: ["selection"],
	type:"separator"
});
browser.contextMenus.create({
    id: menuids.copy_selected_urls,
    title: browser.i18n.getMessage("copy_selected_urls"),
    contexts: ["selection"]
});
browser.contextMenus.create({
    id: menuids.open_selected_urls,
    title: browser.i18n.getMessage("open_selected_urls"),
    contexts: ["selection"]
});
browser.contextMenus.create({
    id: menuids.copy_page_puretext,
    title: browser.i18n.getMessage("copy_page_puretext"),
    contexts: ["page"]
});
browser.contextMenus.create({
    id: menuids.copy_page_htmltext,
    title: browser.i18n.getMessage("copy_page_htmltext"),
    contexts: ["page"]
});
browser.contextMenus.create({
    contexts: ["page"],
	type:"separator"
});
browser.contextMenus.create({
    id: menuids.copy_page_urls,
    title: browser.i18n.getMessage("copy_page_urls"),
    contexts: ["page"]
});
// browser.contextMenus.create({
//     id: menuids.open_page_urls,
//     title: browser.i18n.getMessage("open_page_urls"),
//     contexts: ["page"]
// });

//Main Methods
browser.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId == menuids.copy_link_name) {
        executeCode("copyToClipboard(" + JSON.stringify(info.linkText) + ");",tab);
    }
	
	if (info.menuItemId == menuids.copy_link_url) {
        executeCode("copyToClipboard(" + JSON.stringify(info.linkUrl) + ");",tab);
    }

    if (info.menuItemId == menuids.copy_selected_puretext || info.menuItemId == menuids.copy_page_puretext) {
        //executeCode("copyToClipboard(" + JSON.stringify(info.selectionText) + ");",tab);  //cant get all page
        executeCode("copySelectedPureText()",tab);
    }

    if (info.menuItemId == menuids.copy_selected_htmltext || info.menuItemId == menuids.copy_page_htmltext) {
        executeCode("copySelectedHtmlText();",tab);
    }

    if (info.menuItemId == menuids.copy_selected_urls || info.menuItemId == menuids.copy_page_urls) {
        executeCode("copySelectedUrls();",tab);
    }

    //if (info.menuItemId == menuids.open_selected_urls || info.menuItemId == menuids.open_page_urls) {	//disable open page urls
    if (info.menuItemId == menuids.open_selected_urls) {
        executeCode("openSelectedUrls();",tab);
    }

});

//Common Method
//execute script on page. This function is modified from "https://github.com/mdn/webextensions-examples/tree/master/context-menu-copy-link-with-types"
function executeCode(code,tab) {
    browser.tabs.executeScript({code: "typeof copyToClipboard === 'function';",}).then((results) => {if (!results || results[0] !== true) {return browser.tabs.executeScript(tab.id, {file: "content.js"});}}).then(() => {return browser.tabs.executeScript(tab.id, {code});}).catch((error) => {console.error("Failed to executeCode: " + error);});
}

//open tabs.
browser.runtime.onMessage.addListener(function(urls) {
    urls.forEach(function(url) {
        browser.tabs.create({url:url});
    });
});