chrome.browserAction.onClicked.addListener(emailTabs);

function emailTabs() {
    chrome.tabs.getAllInWindow(null, function(tabs){
        getTabs(tabs, function(full_mail_link){
          chrome.tabs.create({ url: full_mail_link });
        });
    });
}

function getTabs(tabs, callback) {  
  var body = "mailto:?body=";
  var signature = "%0A -Sent with Email All Tabs";
  var max_ttl_url = 2000 - signature.length;
  
  var length = tabs.length;

  var avg = max_ttl_url / length;  //can also use set num. e.g. 150. (encoded is longer..)

  for(i=0;i<length;i++){
    url = tabs[i].url;
    if(url.length > avg){ 
      getShortURL(url, function(short_url) {               
         url = short_url; 
       });       
    }    
    body += encodeIt(url);    
  }

    //extra check, if somehow too long
    if(body.length > max_ttl_url){
      body= body.substring(0, max_ttl_url) + "..." ;
    }

      body += signature; 
      callback(body); 

}


function encodeIt(url)
{
  return encodeURIComponent(url)+ "%0A"; 
}


function getShortURL(long_url, callback ){
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