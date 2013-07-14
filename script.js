chrome.browserAction.onClicked.addListener(emailTabs);

/*
* Create new tab with URL of the email link from getTabs.
*/
function emailTabs() {
    chrome.tabs.getAllInWindow(null, function(tabs){
        getTabs(tabs, function(full_mail_link){
          chrome.tabs.create({ url: full_mail_link });
        });
    });
}

/*
* Goes through all tabs and adds URL to body of email
* Adds title too if option selected.
* getShortURL on URLs that seem too long. 
*/
function getTabs(tabs, callback) {
  var start="mailto:?body=";
  var body = "";
  var signature = localStorage["signature"];
  if(signature==null){
    signature = "--Sent with Email all Tabs";
  }
  var max_ttl_url = 1600 - signature.length; //max could be 2000, but can grow..

  sendTitle = (localStorage["sendTitle"]=="true");

  tlength = tabs.length;
  //could also offer options for these: 
  var titleLength = 35;
  titleCutoff = sendTitle ? (tlength*titleLength*1.5) : 0;
  var avg = (max_ttl_url - titleCutoff) / tlength;

  for(i=0;i<tlength;i++){
    url = tabs[i].url;
    if(url.length > avg){
      getShortURL(url, function(short_url) {
         url = short_url;
       });
    }

    body += url;

    if(sendTitle){
      title = tabs[i].title;
      if(title.length > titleLength){
        title = shortenText(title, " ", titleLength, "..");
      }
      body += " : " + title;
    }
    body += "\n";
  }
  body += signature;
  var encoded_string = start + encodeURIComponent(body);

  //extra check, if still too long
  encoded_string = shortenText(encoded_string, "%0A", max_ttl_url, "%0A ..shortened");
  console.log(encoded_string)

  callback(encoded_string);
}

function shortenText(text, cutoff, max, end)
{
  if(text.length > max){
    return text.substring(0, max).substring(0, Math.min(text.length, text.lastIndexOf(cutoff))) + end;
  }
  else{
    return text;
  }
}

/* 
*  Shortens URLs through goo.gl
*/
function getShortURL(long_url, callback){
  xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyBXFUjrttHd7zWtYIbWkicMKqPgTvrybsQ", false);
  //false, since asynchronous creates too many complications, but keeping callbacks in.

  xmlHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");

  jsonStr = JSON.stringify( {longUrl: long_url} );
  xmlHttp.send(jsonStr);

  var obj = JSON.parse(xmlHttp.response);
  short_url = obj.id;
  //console.log(short_url);

  //if some error, just send back long URL
  if(short_url != null && short_url.substring(0,4)=="http"){
    callback(short_url);
  }
  else{
    callback(long_url);
  }
}
