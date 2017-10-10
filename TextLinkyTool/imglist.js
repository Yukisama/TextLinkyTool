//show images
function showImages(msg) {
    browser.runtime.onMessage.removeListener(showImages);
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
}

//page listener
browser.runtime.onMessage.addListener(showImages);
document.querySelector("#inpColor").addEventListener("change",(e)=>{document.body.style.backgroundColor=e.target.value;});