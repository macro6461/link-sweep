const callSweep = (tab) => {
  const {id, url} = tab;
  chrome.scripting.executeScript(
    {
      target: {tabId: id, allFrames: true},
      files: ['sweep.js']
    }
  )
  console.log(`Loading: ${url}`); 
}

// this will detect the click.
chrome.action.onClicked.addListener((tab)=>callSweep(tab));