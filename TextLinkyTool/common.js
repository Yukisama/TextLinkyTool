//string.format
String.prototype.format = function () {
    let formatted = this;
    for (let i = 0; i < arguments.length; i++) {
        let regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

//command lookup
const commonLookup = {
    menuids : {
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
        show_image:"20",
        copy_link_format_text: "18",
        copy_tab_format_text: "19"
    },
    defaultTltSetting : {
        openPagesLimit: 10,
        linkCustomFormat: "Name:[[name]][[n]]Url:[[url]]",
        tabCustomFormat: "Name:[[name]][[n]]Url:[[url]]",
        toolbarButtonAction: "12",
        keyboardShortcutAction: "3",
        fixUrlQuotEnd:true
    },
    getUserTltSetting() {
        return browser.storage.local.get({userTltSetting:commonLookup.defaultTltSetting});
    }
}