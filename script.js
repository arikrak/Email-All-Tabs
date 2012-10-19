chrome.browserAction.onClicked.addListener(emailTabs);

function getTabs(tabs) {
  
  var body = ""
  var subject = "--Tabs about: " //too messy for subject
  var full_link="mailto:?body=";
  var signature = "%0A --Sent with Email All Tabs :)";
  var max_url = 1023; //2000?
  for (var i = 0; i < tabs.length; i++) {
    body += encodeURIComponent(tabs[i].url) + "%0A";
    subject += makeTitle(tabs[i].title);
  }
  if(full_link.length + subject.length+ body.length + signature.length < max_url){
  full_link += subject+"%0A"+body + signature;
  }
  else{
    full_link += body;
    if(full_link.length > max_url){
    //next version can use goo.gl to shorten links
    full_link = full_link.substring(0, max_url-16);
    full_link = full_link.substring(0, Math.min(full_link.length, full_link.lastIndexOf("%0A"))) + "%0A ..shortened";
   }
 }
   
  console.log(full_link);
  return full_link;
}

function makeTitle(title)
{
  //allow option for keeping titles or not
    max = 28;
    if(title.length > max){
      title = title.substring(0, max);
      title = title.substring(0, Math.min(title.length, title.lastIndexOf(" "))) + "..";
    }
    return encodeURIComponent(title) +" * ";
}

function emailTabs() {
    chrome.tabs.getAllInWindow(null, function(tabs){
        var fulldata = getTabs(tabs);
        chrome.tabs.create({ url: fulldata });
    });
}

function getShortURL(long_url)
{
var xmlHttp = new XMLHttpRequest();

xmlHttp.open("POST", "https://www.googleapis.com/urlshortener/v1/url", true);
xmlHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");

var req = new Object();
req.longUrl = long_url;

var jsonStr = JSON.stringify(req);
xmlHttp.send(jsonStr);

var short_url = JSON.parse(jsonStr).id ; //remove tostringandback loop

//add check for success in json or string
if(short_url!= null && short_url.substring(0,4)=="http"){
  return short_url;
}
else{
  return long_url; //**or nothing if nec.. ** 
}


}

