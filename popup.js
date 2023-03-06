callSweep = (tab) => {
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
    document.getElementById('link-sweep-popup').firstChild.innerHTML = '<p>LinkSweep is not available for this site.</p>'
  }
}

getCurrentTab = async () => {
  let queryOptions = { active: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

getCurrentTab().then((tab)=>{
  callSweep(tab)
})