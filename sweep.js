gatherUrls = (type) =>{
    const functionsObj = {
        'medium': mediumHelper,
        'blogger': bloggerHelper
    }
    const linkObj = {}
    const helper = functionsObj[type]
    const links = document.links
    for (let i = 0; i < links.length; ++i){
        let link = links[i]
        link = helper(link)
        linkObj[link] = link
    }
    return Object.values(linkObj).join("\n\n").trim()
}

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
            console.log('Copied links!');
            createPopUp()
        },
        (err) => {
            createPopUp(false, err)
            console.log(err)
        }
    );
}

removeSelf = (e) => {
    e.target.parentElement.parentElement.remove()
}

popupHelper = (isNotAvailable, err) => {
    let middle = `
            <div>
                <p>Links copied to clipboard!</p>
                <p>If you liked this tool, please leave a tip or follow me on Medium!</p>
                <p>Please report any bugs on Github.</p>
                <p>Thanks for using Link Sweep!</p>
            </div>
    `
    if (isNotAvailable){
        middle = `
            <div>
                <p>LinkSweep does not have access to this website. :(</p>
                <p>This extension currently only works for Medium and Blogger.</p>
                <p>Please report any bugs on Github.</p>
                <p>Thanks for using Link Sweep!</p>
            </div>
        `
    }

    if (err){
        middle = `
        <div>
            <p>Could not copy links. :(</p>
            <p style="color: red;">${err}</p>
            <p>If Document is not focused, simply click in the post and try again.</p>
            <p>Thanks for using Link Sweep!</p>
        </div>
    `
    }

    return middle
}

createPopUp = (isNotAvailable, err) => {
    const middle = popupHelper(isNotAvailable, err)
    const html = `
        <div id="link-sweep-popup">
        <button id="close-link-sweep">x</button>
            ${middle}
            <a href="https://paypal.me/mattcroak?country.x=US&amp;locale.x=en_US" target="_blank">Paypal</a>
            <a href="https://matt-croak.medium.com/membership" target="_blank">Medium</a>
            <a href="https://www.vecteezy.com/free-vector/broom-icon" target="_blank">Broom Icon Vectors by Vecteezy</a>
        </div>
    `
    const popup = document.createElement('div')
    popup.id = "link-sweep-popup-outer"
    popup.innerHTML = html
    // Use top.document to access the outermost document.
    // Useful for blogger which uses an iframe for the post editing space.
    // Works for both Medium and Blogger.
    top.document.body.appendChild(popup)
    top.document.getElementById('close-link-sweep').addEventListener('click', removeSelf)
}

sweep = async () => {
    // be sure to remove any remaining popups
    var orphan = document.getElementById('link-sweep-popup-outer')
    if (orphan) orphan.remove()

    const url = window.location.href
    const regex = /medium|blogger/g;
    const matched = url.match(regex)

    if (matched.length > 0){
        try {
            const hasPermissions = await permissionsCheck();
            if (hasPermissions) {
                const contentLinks = gatherUrls(matched[0]);
                if (contentLinks.length) {
                    updateClipboard(contentLinks)
                }
            } else {
                alert(`In order to use this extension, you need to enable access to your clipboard.\n
                If you did enable access, please click the icon again. :)`);
            }
        } catch (err) {
            console.error(err);
            createPopUp(false, err)
        }
    } else {
        createPopUp(true)
    }
}

sweep()
