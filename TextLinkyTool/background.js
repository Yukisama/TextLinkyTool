//Menus Methods
function menuCombine(tab)
{
    //Filter block list
    let taburl=tab.url;
    if (taburl.startsWith("https://addons.mozilla.org/") || taburl.startsWith("moz-extension://") || (taburl.startsWith("about:") && taburl != "about:blank")) {
        return;
    }

    //Toolbar button enable
    browser.browserAction.enable(tab.id);

    //Context menus combine
    browser.contextMenus.create({
        id: commonLookup.actlist.copySelectedPuretext,
        title: browser.i18n.getMessage("copySelectedPuretext"),
        contexts: ["selection"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.copySelectedHtmltext,
        title: browser.i18n.getMessage("copySelectedHtmltext"),
        contexts: ["selection"]
    });
    browser.contextMenus.create({
        type: "separator",
        contexts: ["selection"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.copyLinkName,
        title: browser.i18n.getMessage("copyLinkName"),
        contexts: ["link"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.copyLinkUrl,
        title: browser.i18n.getMessage("copyLinkUrl"),
        contexts: ["link"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.copyLinkFormatText,
        title: browser.i18n.getMessage("copyLinkFormatText"),
        contexts: ["link"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.copyImageUrl,
        title: browser.i18n.getMessage("copyImageUrl"),
        contexts: ["image"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.showImage,
        title: browser.i18n.getMessage("showImage"),
        contexts: ["image"]
    });
    browser.contextMenus.create({
        type: "separator",
        contexts: ["link", "image"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.copySelectedUrls,
        title: browser.i18n.getMessage("copySelectedUrls"),
        contexts: ["selection"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.openSelectedUrls,
        title: browser.i18n.getMessage("openSelectedUrls"),
        contexts: ["selection"]
    });
    browser.contextMenus.create({
        type: "separator",
        contexts: ["selection"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.copySelectedImageUrls,
        title: browser.i18n.getMessage("copySelectedImageUrls"),
        contexts: ["selection"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.showSelectedImages,
        title: browser.i18n.getMessage("showSelectedImages"),
        contexts: ["selection"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.copyPagePuretext,
        title: browser.i18n.getMessage("copyPagePuretext"),
        contexts: ["page"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.copyPageHtmltext,
        title: browser.i18n.getMessage("copyPageHtmltext"),
        contexts: ["page"]
    });
    browser.contextMenus.create({
        type: "separator",
        contexts: ["page"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.copyPageUrls,
        title: browser.i18n.getMessage("copyPageUrls"),
        contexts: ["page"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.openPageUrls,
        title: browser.i18n.getMessage("openPageUrls"),
        contexts: ["page"]
    });
    browser.contextMenus.create({
        type: "separator",
        contexts: ["page"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.copyPageImageUrls,
        title: browser.i18n.getMessage("copyPageImageUrls"),
        contexts: ["page"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.showPageImages,
        title: browser.i18n.getMessage("showPageImages"),
        contexts: ["page"]
    });
    browser.contextMenus.create({
        type: "separator",
        contexts: ["page"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.copyTabName,
        title: browser.i18n.getMessage("copyTabName"),
        contexts: ["tab"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.copyTabUrl,
        title: browser.i18n.getMessage("copyTabUrl"),
        contexts: ["tab"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.copyTabFormatText,
        title: browser.i18n.getMessage("copyTabFormatText"),
        contexts: ["tab"]
    });
    browser.contextMenus.create({
        type: "separator",
        contexts: ["tab"]
    });
    browser.contextMenus.create({
        id: commonLookup.actlist.copyAllTabsInfo,
        title: browser.i18n.getMessage("copyAllTabsInfo"),
        contexts: ["tab"]
    });
}
function tabActivated(tab)
{
    //Menus rebuild
    browser.menus.removeAll().then(()=>{
        browser.browserAction.disable(tab.tabId);
        browser.tabs.get(tab.tabId).then(menuCombine);
    });
}
function tabUpdated(tabid, info, tab)
{
    //Menus rebuild
    if (tab.status=="complete")
    browser.menus.removeAll().then(()=>{
        browser.browserAction.disable(tab.id);
        menuCombine(tab);
    });
}

//Main Methods
browser.contextMenus.onClicked.addListener((info, tab) => {
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then((acttabs) => {
        let acttab = acttabs[0];
        switch (info.menuItemId) {
            case commonLookup.actlist.copySelectedPuretext:
            case commonLookup.actlist.copyPagePuretext:
            case commonLookup.actlist.copySelectedHtmltext:
            case commonLookup.actlist.copyPageHtmltext:
            case commonLookup.actlist.copySelectedUrls:
            case commonLookup.actlist.copyPageUrls:
            case commonLookup.actlist.openSelectedUrls:
            case commonLookup.actlist.openPageUrls:
            case commonLookup.actlist.copySelectedImageUrls:
            case commonLookup.actlist.copyPageImageUrls:
            case commonLookup.actlist.showSelectedImages:
            case commonLookup.actlist.showPageImages:
                executeCommand(acttab, {
                    cmd: info.menuItemId
                });
                break;
            case commonLookup.actlist.copyLinkName:
            case commonLookup.actlist.copyLinkUrl:
            case commonLookup.actlist.copyLinkFormatText:
                executeCommand(acttab, {
                    cmd: info.menuItemId,
                    data: {
                        name: info.linkText,
                        url: info.linkUrl
                    }
                });
                break;
            case commonLookup.actlist.copyTabName:
            case commonLookup.actlist.copyTabUrl:
            case commonLookup.actlist.copyTabFormatText:            
                executeCommand(acttab, {
                    cmd: info.menuItemId,
                    data: {
                        name: tab.title,
                        url: tab.url
                    }
                });
                break;
            case commonLookup.actlist.copyAllTabsInfo:
                let tabsInfo=[];
                browser.tabs.query({currentWindow:true}).then((ti)=>{
                    ti.forEach((t)=>{
                        tabsInfo.push({name:t.title,url:t.url});
                    });
                    executeCommand(acttab, {
                        cmd: info.menuItemId,
                        data: tabsInfo
                    });
                });
                break;
            case commonLookup.actlist.copyImageUrl:
                executeCommand(acttab, {
                    cmd: info.menuItemId,
                    data: {
                        url: info.srcUrl
                    }
                });
                break;
            case commonLookup.actlist.showImage:
                commonLookup.getUserTltSetting().then((tlt) => {
                    let data = [info.srcUrl];
                    let cmd = commonLookup.actlist.serverOpenTabs;
                    if (tlt.userTltSetting.openOneImageDirectly === false) {
                        cmd = commonLookup.actlist.serverShowImages;
                    }
                    serverAction({
                        cmd: cmd,
                        data: data
                    });
                });
                break;
            default:
                console.log("no use");
        }
    });
});
browser.browserAction.onClicked.addListener((tab) => {
    executeCommand(tab, {
        cmd: commonLookup.actlist.toolbarButtonAction
    });
});
browser.commands.onCommand.addListener((command) => {
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then((acttabs) => {
        let acttab = acttabs[0];
        executeCommand(acttab, {
            cmd: commonLookup.actlist.keyboardShortcutAction
        });
    });
});

//Common Method
//execute command on page
function executeCommand(tab, msg) {
    browser.tabs.sendMessage(tab.id, msg)
        .then(() => {
            console.log("Command executed.");
        })
        .catch((errmsg) => {
            console.error(`Command failed: ${errmsg}`);
        });
}

//execute command on background
function serverAction(msg) {
    switch (msg.cmd) {
        case commonLookup.actlist.serverOpenTabs:
            msg.data.forEach((u) => {
                browser.tabs.create({
                    url: u
                });
            });
            break;
        case commonLookup.actlist.serverShowImages:
            browser.tabs.create({
                url: "imglist.html"
            }).then((tab) => {
                browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
                    if (tabId == tab.id) {
                        executeCommand(tab, msg);
                    }
                });
            });
            break;
        default:
            console.log("no use");
    }
}

//tabs listener
browser.tabs.onActivated.addListener(tabActivated);
browser.tabs.onUpdated.addListener(tabUpdated);

//background listener
browser.runtime.onMessage.addListener(serverAction);