//Declarations
const menuids = {
    copy_selected_puretext: "3",
    copy_selected_htmltext: "4",
    copy_link_name: "1",
    copy_link_url: "2",
    copy_selected_urls: "5",
    open_selected_urls: "6",
    copy_selected_image_urls: "11",
    show_selected_images: "12",
    copy_page_puretext: "7",
    copy_page_htmltext: "8",
    copy_page_urls: "9",
    open_page_urls: "10",
    copy_page_image_urls: "13",
    show_page_images: "14",
    copy_tab_name: "15",
    copy_tab_url: "16",
    copy_image_url: "17",
    copy_link_format_text: "18",
    copy_tab_format_text: "19"
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
    type: "separator",
    contexts: ["selection"]
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
    id: menuids.copy_link_format_text,
    title: browser.i18n.getMessage("copy_link_format_text"),
    contexts: ["link"]
});
browser.contextMenus.create({
    id: menuids.copy_image_url,
    title: browser.i18n.getMessage("copy_image_url"),
    contexts: ["image"]
});
browser.contextMenus.create({
    type: "separator",
    contexts: ["link","image"]
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
    type: "separator",
    contexts: ["selection"]
});
browser.contextMenus.create({
    id: menuids.copy_selected_image_urls,
    title: browser.i18n.getMessage("copy_selected_image_urls"),
    contexts: ["selection"]
});
browser.contextMenus.create({
    id: menuids.show_selected_images,
    title: browser.i18n.getMessage("show_selected_images"),
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
    type: "separator",
    contexts: ["page"]
});
browser.contextMenus.create({
    id: menuids.copy_page_urls,
    title: browser.i18n.getMessage("copy_page_urls"),
    contexts: ["page"]
});
browser.contextMenus.create({
    id: menuids.open_page_urls,
    title: browser.i18n.getMessage("open_page_urls"),
    contexts: ["page"]
});
browser.contextMenus.create({
    type: "separator",
    contexts: ["page"]
});
browser.contextMenus.create({
    id: menuids.copy_page_image_urls,
    title: browser.i18n.getMessage("copy_page_image_urls"),
    contexts: ["page"]
});
browser.contextMenus.create({
    id: menuids.show_page_images,
    title: browser.i18n.getMessage("show_page_images"),
    contexts: ["page"]
});
browser.contextMenus.create({
    type: "separator",
    contexts: ["page"]
});
browser.contextMenus.create({
    id: menuids.copy_tab_name,
    title: browser.i18n.getMessage("copy_tab_name"),
    contexts: ["tab"]
});
browser.contextMenus.create({
    id: menuids.copy_tab_url,
    title: browser.i18n.getMessage("copy_tab_url"),
    contexts: ["tab"]
});
browser.contextMenus.create({
    id: menuids.copy_tab_format_text,
    title: browser.i18n.getMessage("copy_tab_format_text"),
    contexts: ["tab"]
});

//Main Methods
browser.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case menuids.copy_link_name:
            executeCode(`copyToClipboard(${JSON.stringify(info.linkText)})`, tab);
            break;
        case menuids.copy_link_url:
            executeCode(`copyToClipboard(${JSON.stringify(info.linkUrl)})`, tab);
            break;
        case menuids.copy_selected_puretext:
        case menuids.copy_page_puretext:
            executeCode("copySelectedPureText()", tab);
            break;
        case menuids.copy_selected_htmltext:
        case menuids.copy_page_htmltext:
            executeCode("copySelectedHtmlText()", tab);
            break;
        case menuids.copy_selected_urls:
        case menuids.copy_page_urls:
            executeCode("copySelectedUrls()", tab);
            break;
        case menuids.open_selected_urls:
        case menuids.open_page_urls:
            executeCode("openSelectedUrls()", tab);
            break;
        case menuids.copy_selected_image_urls:
        case menuids.copy_page_image_urls:
            executeCode("copySelectedImageUrls()", tab);
            break;
        case menuids.show_selected_images:
        case menuids.show_page_images:
            executeCode("showSelectedImages()", tab);
            break;
        case menuids.copy_tab_name:
            executeCode(`copyToClipboard(${JSON.stringify(tab.title)})`, tab);
            break;
        case menuids.copy_tab_url:
            executeCode(`copyToClipboard(${JSON.stringify(tab.url)})`, tab);
            break;           
        case menuids.copy_image_url:
            executeCode(`copyToClipboard(${JSON.stringify(info.srcUrl)})`, tab);
            break;
        case menuids.copy_link_format_text:
            executeCode(`copyLinkFormatText(${JSON.stringify(info.linkText)},${JSON.stringify(info.linkUrl)})`, tab);
            break;
        case menuids.copy_tab_format_text:
            executeCode(`copyTabFormatText(${JSON.stringify(tab.title)},${JSON.stringify(tab.url)})`, tab);
            break;
        default:
            console.log('no use');
    }
});

//Common Method
//execute script on page
function executeCode(execode, tab) {
    browser.tabs.executeScript(tab.id, {
        code: execode
    }).then(() => { console.log("Code executed."); }, (errmsg) => { console.error("Failed to executeCode: " + errmsg); });
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
            browser.tabs.create({url:"/imglist.html"}).then((tab) => {
                browser.tabs.sendMessage(tab.id,msg).then(() => { console.log("showImgs executed."); }, (errmsg) => { console.error("Failed to showImgs: " + errmsg); }); 
            });
            break;
        default:
            console.log('no use');
    }
});