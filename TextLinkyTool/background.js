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
    commonLookup.getUserTltSetting().then((tlt)=>{
        browser.contextMenus.create({
            id: commonLookup.actlist.copySelectedPuretext + "-0",
            title: browser.i18n.getMessage("copySelectedPuretext"),
            contexts: ["selection"]
        });
        browser.contextMenus.create({
            id: commonLookup.actlist.copySelectedHtmltext + "-0",
            title: browser.i18n.getMessage("copySelectedHtmltext"),
            contexts: ["selection"]
        });
        browser.contextMenus.create({
            id: "separator-0",
            type: "separator",
            contexts: ["selection"]
        });
        browser.contextMenus.create({
            id: commonLookup.actlist.copyLinkName + "-0",
            title: browser.i18n.getMessage("copyLinkName"),
            contexts: ["link"]
        });
        browser.contextMenus.create({
            id: commonLookup.actlist.copyLinkUrl + "-0",
            title: browser.i18n.getMessage("copyLinkUrl"),
            contexts: ["link"]
        });
        tlt.userTltSetting.linkCustomFormatList.forEach((item,idx)=>{
            browser.contextMenus.create({
                id: commonLookup.actlist.copyLinkFormatText + "-" + idx.toString(),
                title: browser.i18n.getMessage("copyLinkFormatText").replace("{0}",item.name),
                contexts: ["link"]
            });
        });
        browser.contextMenus.create({
            id: commonLookup.actlist.copyImageUrl + "-0",
            title: browser.i18n.getMessage("copyImageUrl"),
            contexts: ["image"]
        });
        browser.contextMenus.create({
            id: commonLookup.actlist.showImage + "-0",
            title: browser.i18n.getMessage("showImage"),
            contexts: ["image"]
        });
        browser.contextMenus.create({
            id: "separator-1",
            type: "separator",
            contexts: ["link", "image"]
        });
        browser.contextMenus.create({
            id: commonLookup.actlist.copySelectedUrls + "-0",
            title: browser.i18n.getMessage("copySelectedUrls"),
            contexts: ["selection"]
        });
        browser.contextMenus.create({
            id: commonLookup.actlist.openSelectedUrls + "-0",
            title: browser.i18n.getMessage("openSelectedUrls"),
            contexts: ["selection"]
        });
        browser.contextMenus.create({
            id: "separator-2",
            type: "separator",
            contexts: ["selection"]
        });
        browser.contextMenus.create({
            id: commonLookup.actlist.copySelectedImageUrls + "-0",
            title: browser.i18n.getMessage("copySelectedImageUrls"),
            contexts: ["selection"]
        });
        browser.contextMenus.create({
            id: commonLookup.actlist.showSelectedImages + "-0",
            title: browser.i18n.getMessage("showSelectedImages"),
            contexts: ["selection"]
        });
        browser.contextMenus.create({
            id: commonLookup.actlist.copyPagePuretext + "-0",
            title: browser.i18n.getMessage("copyPagePuretext"),
            contexts: ["page"]
        });
        browser.contextMenus.create({
            id: commonLookup.actlist.copyPageHtmltext + "-0",
            title: browser.i18n.getMessage("copyPageHtmltext"),
            contexts: ["page"]
        });
        browser.contextMenus.create({
            id: "separator-3",
            type: "separator",
            contexts: ["page"]
        });
        tlt.userTltSetting.urlsCustomFormatList.forEach((item,idx)=>{
            browser.contextMenus.create({
                id: commonLookup.actlist.copyPageUrls + "-" + idx.toString(),
                title: browser.i18n.getMessage("copyPageUrls") + "(" + item.name + ")",
                contexts: ["page"]
            });
        });
        browser.contextMenus.create({
            id: commonLookup.actlist.openPageUrls + "-0",
            title: browser.i18n.getMessage("openPageUrls"),
            contexts: ["page"]
        });
        browser.contextMenus.create({
            id: "separator-4",
            type: "separator",
            contexts: ["page"]
        });
        tlt.userTltSetting.imageUrlsCustomFormatList.forEach((item,idx)=>{
            browser.contextMenus.create({
                id: commonLookup.actlist.copyPageImageUrls + "-" + idx.toString(),
                title: browser.i18n.getMessage("copyPageImageUrls") + "(" + item.name + ")",
                contexts: ["page"]
            });
        });
        browser.contextMenus.create({
            id: commonLookup.actlist.showPageImages + "-0",
            title: browser.i18n.getMessage("showPageImages"),
            contexts: ["page"]
        });
        browser.contextMenus.create({
            id: "separator-5",
            type: "separator",
            contexts: ["page"]
        });
        browser.contextMenus.create({
            id: commonLookup.actlist.copyTabName + "-0",
            title: browser.i18n.getMessage("copyTabName"),
            contexts: ["tab"]
        });
        browser.contextMenus.create({
            id: commonLookup.actlist.copyTabUrl + "-0",
            title: browser.i18n.getMessage("copyTabUrl"),
            contexts: ["tab"]
        });
        tlt.userTltSetting.tabCustomFormatList.forEach((item,idx)=>{
            browser.contextMenus.create({
                id: commonLookup.actlist.copyTabFormatText + "-" + idx.toString(),
                title: browser.i18n.getMessage("copyTabFormatText").replace("{0}",item.name),
                contexts: ["tab"]
            });
        });
        browser.contextMenus.create({
            id: "separator-6",
            type: "separator",
            contexts: ["tab"]
        });
        tlt.userTltSetting.tabsinfoCustomFormatList.forEach((item,idx)=>{
            browser.contextMenus.create({
                id: commonLookup.actlist.copyAllTabsInfo + "-" + idx.toString(),
                title: browser.i18n.getMessage("copyAllTabsInfo") + "(" + item.name + ")",
                contexts: ["tab"]
            });
        });
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
        let actinfo = info.menuItemId.split("-");
        let actid = actinfo[0];
        let actidx = Number(actinfo[1]);
        switch (actid) {
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
                    cmd: actid,
                    idx: actidx
                });
                break;
            case commonLookup.actlist.copyLinkName:
            case commonLookup.actlist.copyLinkUrl:
            case commonLookup.actlist.copyLinkFormatText:
                executeCommand(acttab, {
                    cmd: actid,                    
                    data: {
                        name: info.linkText,
                        url: info.linkUrl
                    },
                    idx: actidx
                });
                break;
            case commonLookup.actlist.copyTabName:
            case commonLookup.actlist.copyTabUrl:
            case commonLookup.actlist.copyTabFormatText:            
                executeCommand(acttab, {
                    cmd: actid,
                    data: {
                        name: tab.title,
                        url: tab.url
                    },
                    idx: actidx
                });
                break;
            case commonLookup.actlist.copyAllTabsInfo:
                let tabsInfo=[];
                browser.tabs.query({currentWindow:true}).then((ti)=>{
                    ti.forEach((t)=>{
                        tabsInfo.push({name:t.title,url:t.url});
                    });
                    executeCommand(acttab, {
                        cmd: actid,
                        data: tabsInfo,
                        idx: actidx
                    });
                });
                break;
            case commonLookup.actlist.copyImageUrl:
                executeCommand(acttab, {
                    cmd: actid,
                    data: {
                        url: info.srcUrl
                    },
                    idx: actidx
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
                        data: data,
                        idx: actidx
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