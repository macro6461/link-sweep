// Unable to use 'const' and need to instead use 'let' until workaround is found.
// Unfortunately when re-injecting script, you get an error saying [FUNCTION] was already declared.

var gatherUrls = (type) =>{

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

    return Object.values(linkObj).join("\n\n")
}

var mediumHelper = (link) => {
    if (link.className.indexOf('markup--p') > -1){
        let l = link.href.split(/\?url\=/)[1]
        l = l ?? link.href
        l = decodeURIComponent(l)
        return l
    }
}

var bloggerHelper = (link) => {
    if (link){
        if (link.getAttribute('data-original-attrs')){
            return JSON.parse(link.getAttribute('data-original-attrs'))['data-original-href']
        }
    } else {
        
    }
}

var permissionsCheck = async () => {
    let read = await navigator.permissions.query({name: 'clipboard-read'})
    let write = await navigator.permissions.query({name: 'clipboard-write'})
    return read.state === 'granted' && write.state === 'granted'
}

var updateClipboard = (contentLinks) => {
    
    navigator.clipboard.writeText(contentLinks).then(() => {
        console.log('Copied links!')
        return true
      /* clipboard successfully set */
    }, () => {
        console.log('Could not copy links!')
        alert(`In order to use this extension, you need to enable access to your clipboard.\n
        If you did enable access, please click the icon again. :)`)
        return false
    });
}

var sweep = async () => {
    const url = window.location.href
    const regex = /medium|blogger/g;
    const type = url.match(regex)[0]
    await permissionsCheck().then(allowed => {
        if (allowed){
            const contentLinks = gatherUrls(type);
            if (contentLinks.length > 0 && ok) {
                return updateClipboard(contentLinks)
            }
        } else {
            alert(`In order to use this extension, you need to enable access to your clipboard.\n
            If you did enable access, please click the icon again. :)`)
        }
    })

}

sweep()
