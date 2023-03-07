const callSweep = (tab) => {
  const {id, url} = tab;
  if (url.indexOf('https://medium.com/p/') > -1 || url.indexOf('www.blogger.com/blog/post/edit/') > -1 ){
    chrome.scripting.executeScript(
      {
        target: {tabId: id, allFrames: true},
        files: ['sweep.js']
      }
    )
    console.log(`Loading: ${url}`); 
  } else {
    const sorryText = `
      <p>LinkSweep is not available for this site.</p>
      <p>The extension currently offers support for Medium and Blogger.</p>
      <p>Thank you :)</p>
    `
    // let user know that the popup does not work with the site.
    document.getElementById('link-sweep-popup').children[0].innerHTML = newText
  }
}

 const getCurrentTab = async () => {
  let queryOptions = { active: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

getCurrentTab().then((tab)=>{
  callSweep(tab)
})