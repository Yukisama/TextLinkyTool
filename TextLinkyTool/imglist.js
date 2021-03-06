//show images
function showImages(msg) {
    if (msg.cmd !== commonLookup.actlist.serverShowImages) {
        return;
    }
    document.querySelector("#lblFrom").textContent = `${msg.data.title}(${msg.data.location})`;
    let frag = document.createDocumentFragment();
    msg.data.urls.forEach((value) => {
        let i = document.createElement("img");
        i.alt = value;
        i.src = value;
        let a = document.createElement("a");
        a.href = value;
        a.target = "_blank";
        a.appendChild(i);
        frag.appendChild(a);
    });
    document.body.appendChild(frag);
    document.querySelector("#spnCount").textContent = ` - ${msg.data.urls.length.toString()} pics`;
    browser.runtime.onMessage.removeListener(showImages);
}

//color change
function colorChange(e) {
    document.body.style.backgroundColor = e.target.value;
}

//display mode change
function displayModeChange(e) {
    document.querySelectorAll("a").forEach((e) => {
        e.classList.toggle('display');
    });
}

//page listener
browser.runtime.onMessage.addListener(showImages);
document.querySelector("#inpColor").addEventListener("change", colorChange);
document.querySelector("#inpDisplay").addEventListener("click", displayModeChange);