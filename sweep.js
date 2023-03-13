gatherUrls = (type) =>{
    const functionsObj = {
        'medium': mediumHelper,
        'blogger': bloggerHelper,
        'tumblr': tumblrHelper
    }
    const linkObj = {}
    const helper = functionsObj[type]
    const links = type === "tumblr" 
    ? tumblrLinksHelper() 
    : document.links
    for (let i = 0; i < links.length; ++i){
        let link = links[i]
        link = helper(link)
        linkObj[link] = link
    }
    var str = type === "tumblr" ? "\n\n" : "\n"
    return Object.values(linkObj).join(str).trim()
}

///////// HELPERS
mediumHelper = (link) => {
    if (link.className.indexOf('markup--p') > -1){
        let l = link.href.split(/\?url\=/)[1]
        l = l ?? link.href
        l = decodeURIComponent(l)
        return l
    }
}

bloggerHelper = (link) => {
    if (link && link.getAttribute('data-original-attrs')){
        return JSON.parse(link.getAttribute('data-original-attrs'))['data-original-href']
    }
}

tumblrLinksHelper = () => {
    // do this rather than get EVERY link on a tumblr webpage
    let container = document.getElementsByClassName('block-editor-writing-flow')[0]
    return container.getElementsByTagName("a")
}

tumblrHelper = (link) => {
    return link.href
}

///////// END OF HELPERS

permissionsCheck = async () => {
    const read = await navigator.permissions.query({
        name: 'clipboard-read',
    });
    const write = await navigator.permissions.query({
        name: 'clipboard-write',
    });
    return write.state === 'granted' && read.state !== 'denied';
}

updateClipboard = async (content) => {
    navigator.clipboard.writeText(content).then(
        () => {
            createPopUp()
        },
        (err) => {
            createPopUp(false, err)
        }
    );
}

// POPUP RELATED CODE

removeSelf = (e) => {
    if (e.target.id === 'close-link-sweep'){
        e.target.parentElement.parentElement.remove()
    }
}

popupHelper = (isNotAvailable, err, noLinks) => {
    let middle = `
            <div id="popup-middle">
                <p>Links copied to clipboard!</p>
                <p>If you liked this tool, please leave a tip or follow me on Medium!</p>
                <p>Please report any bugs on Github.</p>
                <p>Thanks for using Link Sweep!</p>
            </div>
    `
    if (isNotAvailable){
        middle = `
            <div id="popup-middle">
                <p>Link Sweep does not have access to this website. :(</p>
            </div>
        `
    } 
    
    if (err){
        middle = `
        <div id="popup-middle">
            <p>Could not copy links. :(</p>
            <p style="color: red;">${err}</p>
            <p>If Document is not focused, simply click in the post and try again.</p>
            <p>Thanks for using Link Sweep!</p>
        </div>
    `
    } 
    
    if (noLinks){
        middle = `
        <div id="popup-middle">
            <p>There are no links in this post.</p>
            <p>Thanks for using Link Sweep!</p>
        </div>
        `
    }

    return middle
}

handleFormatChange = (format) => {
    
}

createFormattingPopUp = () =>{
    document.getElementById("popup-middle").innerHTML = `
        <div>
            <input type="radio" id="raw" name="raw" value="raw"
                onclick="${(e)=>handleFormatChange(e)}">
            <label for="raw">Raw Links</label>
        </div>

        <div>
            <input type="radio" id="slugs" name="slugs" value="Slugs" onclick="${(e)=>handleFormatChange(e)}">
            <label for="slugs">Slugs</label>
        </div>

        <div>
            <input type="radio" id="inline-slugs" name="inline-slugs" value="inline-slugs" onclick="${(e)=>handleFormatChange(e)}">
            <label for="inline-slugs">Inline Slugs</label>
        </div>
    `
}

createPopUp = (isNotAvailable, err, noLinks) => {

    const middle = popupHelper(isNotAvailable, err, noLinks)
    const imgUrl = chrome.runtime.getURL('./assets/sweepicon.png')
    const html = `
        <div id="link-sweep-popup">
            <img src=${imgUrl} alt="LinkSweep Logo" title="Link Sweep Logo" id="imgtestee"/>
            <button id="close-link-sweep">x</button>
            ${middle}
            <div class="links-container">
                <a href="https://paypal.me/mattcroak?country.x=US&amp;locale.x=en_US" target="_blank">Paypal</a>
                <a href="https://matt-croak.medium.com/membership" target="_blank">Medium</a>
            </div>
        </div>
        <button id="popup-format-button">Formatting</button>
        <div class="icon-link-container">
            <a href="https://www.vecteezy.com/free-vector/broom-icon" target="_blank">Broom Icon Vectors by Vecteezy</a>
        </div>
    `
    const popup = document.createElement('div')
    popup.id = "link-sweep-popup-outer"
    popup.className = "xxxxxxxxx"
    popup.innerHTML = html
 
    top.document.body.appendChild(popup)
    // needed to add it to document because Tumblr prevents adding events to other elements
    top.document.addEventListener('click', removeSelf)
    top.document.getElementById('popup-format-button').addEventListener('click', createFormattingPopUp)
}

sweep = async () => {

    const url = window.location.href
    const regex = /medium|blogger|tumblr/g;
    const matched = url.match(regex)

    if (matched && matched.length > 0){
        try {
            const hasPermissions = await permissionsCheck();
            if (hasPermissions) {
                // be sure to remove any remaining popups
                const contentLinks = gatherUrls(matched[0]);
                if (contentLinks.length > 0) {
                    updateClipboard(contentLinks)
                } else {
                    createPopUp(false, false, true)
                }
            } else {
                createPopUp(false, 'Please enable clipboard access for this website.')
            }
        } catch (err) {
            createPopUp(false, err)
        }
    } else {
        createPopUp(true)
    }
    // For some reason, previous means of getting existing one by ID and removing before recreating
    // didn't work correctly on Tumblr. Need to assign class and remove this way.
    // Works for Medium, Blogger and Tumblr
    setTimeout(()=>{
        var orphanPopups = top.document.getElementsByClassName('xxxxxxxxx')
        if (orphanPopups.length > 1){
            // orphanPopups.length - 2 because we only want the last one added
            for (var i = 0; i < orphanPopups.length - 1; ++i){
                orphanPopups[i].remove()
            }
        }
    }, 500)
}

sweep()
