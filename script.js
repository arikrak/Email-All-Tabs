chrome.browserAction.onClicked.addListener(emailTabs);

/*
 * Create new mailto tab.
 */
function emailTabs() {
  if(localStorage["legacy"]=="true"){
    chrome.tabs.getAllInWindow(null, function(tabs){
      tabsToEmailLink(tabs);
    });
  }
  else {
    chrome.tabs.getAllInWindow(null, function(tabs){
      tabsToClipboard(tabs);
    });
  }
}

/*
 * Convert tabs to HTML links.
 */
function tabsToClipboard(tabs) {
  var text = '';
  for(i=0; i<tabs.length; i++){
    text += "<a href='" + tabs[i].url + "'>" + tabs[i].title + "</a><br>";
  }
  var defaultSignature = "--Sent with&nbsp;<a href='https://chrome.google.com/webstore/detail/email-all-tabs/"
  + "hgebccnmgpigdgkbenjkamcnioejlghh'>Email all Tabs</a>";
  text += localStorage["signature"] || defaultSignature;
  copyToClipboard(text);
  chrome.tabs.create({ url: "mailto:" });
}

// Copy text to clipboard, from the internet.
function copyToClipboard(text){
  var copyDiv = document.createElement('div');
  copyDiv.contentEditable = true;
  document.body.appendChild(copyDiv);
  copyDiv.innerHTML = text;
  copyDiv.unselectable = "off";
  copyDiv.focus();
  document.execCommand('SelectAll');
  document.execCommand("Copy", false, null);
  document.body.removeChild(copyDiv);
}

/*
 * Goes through all tabs and adds URL to body of email.
 */
function tabsToEmailLink(tabs) {
  var text = '';
  var maxTextUrl = 1500;
  var skippedLinks = false;
  for(i=0; i<tabs.length; i++){
    if(text.length += tabs[i].url.length < maxTextUrl){
      text += tabs[i].url + "\n";
    }
    else {
      skippedLinks = true;
    }
  }

  var signature = localStorage["signature"] || "--Sent with Email all Tabs";
  if(text.length + signature.length < maxTextUrl) {
    text += signature;
  }

  var encodedString = encodeURIComponent(text);

  var maxEncodedUrl = 1900;
  if(encodedString.length > maxEncodedUrl){
    skippedLinks = true;
    encodedString = shortenText(encodedString, "%0A", maxEncodedUrl);
  }
  if(skippedLinks) {
    encodedString += "%0A ..shortened";
  }

  chrome.tabs.create({ url: "mailto:?body=" + encodedString});
}

function shortenText(text, cutoff, max) {
  var shortened = text.substring(0, max);
  return shortened.substring(0, shortened.lastIndexOf(cutoff));
}
