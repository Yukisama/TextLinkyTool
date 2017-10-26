//show images
function showImages(msg) {
    if (msg.cmd!=='showImgs'){return;}
    document.querySelector('span').textContent=` - ${msg.data.length.toString()} pics`;
    let frag = document.createDocumentFragment();
    msg.data.forEach((value) => { 
        let i = document.createElement("img");
        i.alt = value;
        i.src = value;
        let a = document.createElement("a");
        a.href = value;
        a.target = '_blank';
        a.appendChild(i);        
        frag.appendChild(a);
    });
    document.body.appendChild(frag);
    browser.runtime.onMessage.removeListener(showImages);
}

//page listener
browser.runtime.onMessage.addListener(showImages);
document.querySelector("#inpColor").addEventListener("change",(e)=>{document.body.style.backgroundColor=e.target.value;});