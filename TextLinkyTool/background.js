//Menus Combine
browser.contextMenus.create({
    id: commonLookup.menuids.copy_selected_puretext,
    title: browser.i18n.getMessage("copy_selected_puretext"),
    contexts: ["selection"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.copy_selected_htmltext,
    title: browser.i18n.getMessage("copy_selected_htmltext"),
    contexts: ["selection"]
});
browser.contextMenus.create({
    type: "separator",
    contexts: ["selection"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.copy_link_name,
    title: browser.i18n.getMessage("copy_link_name"),
    contexts: ["link"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.copy_link_url,
    title: browser.i18n.getMessage("copy_link_url"),
    contexts: ["link"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.copy_link_format_text,
    title: browser.i18n.getMessage("copy_link_format_text"),
    contexts: ["link"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.copy_image_url,
    title: browser.i18n.getMessage("copy_image_url"),
    contexts: ["image"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.show_image,
    title: browser.i18n.getMessage("show_image"),
    contexts: ["image"]
});
browser.contextMenus.create({
    type: "separator",
    contexts: ["link","image"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.copy_selected_urls,
    title: browser.i18n.getMessage("copy_selected_urls"),
    contexts: ["selection"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.open_selected_urls,
    title: browser.i18n.getMessage("open_selected_urls"),
    contexts: ["selection"]
});
browser.contextMenus.create({
    type: "separator",
    contexts: ["selection"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.copy_selected_image_urls,
    title: browser.i18n.getMessage("copy_selected_image_urls"),
    contexts: ["selection"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.show_selected_images,
    title: browser.i18n.getMessage("show_selected_images"),
    contexts: ["selection"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.copy_page_puretext,
    title: browser.i18n.getMessage("copy_page_puretext"),
    contexts: ["page"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.copy_page_htmltext,
    title: browser.i18n.getMessage("copy_page_htmltext"),
    contexts: ["page"]
});
browser.contextMenus.create({
    type: "separator",
    contexts: ["page"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.copy_page_urls,
    title: browser.i18n.getMessage("copy_page_urls"),
    contexts: ["page"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.open_page_urls,
    title: browser.i18n.getMessage("open_page_urls"),
    contexts: ["page"]
});
browser.contextMenus.create({
    type: "separator",
    contexts: ["page"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.copy_page_image_urls,
    title: browser.i18n.getMessage("copy_page_image_urls"),
    contexts: ["page"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.show_page_images,
    title: browser.i18n.getMessage("show_page_images"),
    contexts: ["page"]
});
browser.contextMenus.create({
    type: "separator",
    contexts: ["page"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.copy_tab_name,
    title: browser.i18n.getMessage("copy_tab_name"),
    contexts: ["tab"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.copy_tab_url,
    title: browser.i18n.getMessage("copy_tab_url"),
    contexts: ["tab"]
});
browser.contextMenus.create({
    id: commonLookup.menuids.copy_tab_format_text,
    title: browser.i18n.getMessage("copy_tab_format_text"),
    contexts: ["tab"]
});

//Main Methods
browser.contextMenus.onClicked.addListener((info, tab) => {
    browser.tabs.query({active:true}).then((acttabs)=>{
        let acttab=acttabs[0];
        switch (info.menuItemId) {
            case commonLookup.menuids.copy_selected_puretext:
            case commonLookup.menuids.copy_page_puretext:
            case commonLookup.menuids.copy_selected_htmltext:
            case commonLookup.menuids.copy_page_htmltext:
            case commonLookup.menuids.copy_selected_urls:
            case commonLookup.menuids.copy_page_urls:
            case commonLookup.menuids.open_selected_urls:
            case commonLookup.menuids.open_page_urls:
            case commonLookup.menuids.copy_selected_image_urls:
            case commonLookup.menuids.copy_page_image_urls:
            case commonLookup.menuids.show_selected_images:
            case commonLookup.menuids.show_page_images:
                executeCommand(acttab,{cmd:info.menuItemId});
                break;
            case commonLookup.menuids.copy_link_name:
            case commonLookup.menuids.copy_link_url:
            case commonLookup.menuids.copy_link_format_text:
                executeCommand(acttab,{cmd:info.menuItemId,data:{name:JSON.stringify(info.linkText),url:JSON.stringify(info.linkUrl)}});
                break;
            case commonLookup.menuids.copy_tab_name:
            case commonLookup.menuids.copy_tab_url:
            case commonLookup.menuids.copy_tab_format_text:
                executeCommand(acttab,{cmd:info.menuItemId,data:{name:JSON.stringify(tab.title),url:JSON.stringify(tab.url)}});
                break;           
            case commonLookup.menuids.copy_image_url:
                executeCommand(acttab,{cmd:info.menuItemId,data:{url:JSON.stringify(info.srcUrl)}});
                break;
            case commonLookup.menuids.show_image:        
                browser.tabs.create({url:info.srcUrl});
                break;
            default:
                console.log('no use');
        }
    });
});
browser.browserAction.onClicked.addListener((tab) => {
    executeCommand(tab,{cmd:commonLookup.menuids.toolbar_button_action});
});
browser.commands.onCommand.addListener((command) => {
    browser.tabs.query({currentWindow: true, active: true}).then((tab)=>{
        executeCommand(tab,{cmd:commonLookup.menuids.keyboard_shortcut_action});
    });
});

//Common Method
//execute command on page
function executeCommand(tab,msg) {
    browser.tabs.sendMessage(tab.id,msg).then(() => { console.log("Command executed."); }, (errmsg) => { console.error("Command failed: " + errmsg); }); 
}

//get content message
browser.runtime.onMessage.addListener((msg) => {
    switch (msg.cmd)
    {
        case 'openTabs':
            msg.data.forEach((u) => { 
                browser.tabs.create({ url: u });
            });
            break;
        case 'showImgs':
            browser.tabs.create({url:"imglist.html"}).then((tab) => {
                browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo)=>{
                    if (tabId==tab.id){
                        executeCommand(tab,msg); 
                    }
                });
            });
            break;
        default:
            console.log('no use');
    }
});