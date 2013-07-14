// Saves options to localStorage.
function save_options() {
  var select = document.getElementById("sendTitle");
  var sendTitle = select.children[select.selectedIndex].value;
  localStorage["sendTitle"] = sendTitle;

  var input = document.getElementById("signature");
  var signature = input.value;
  localStorage["signature"] = signature; 

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
//can switch to radio button
function restore_options() {
  var select = document.getElementById("sendTitle");
  var boolTitle = localStorage["sendTitle"];
  if(boolTitle == "true"){
    select.children[0].selected  = "true";
  }
  else{
    select.children[1].selected = "true";
  }

  var signature = localStorage["signature"];
  if(signature==null){
    signature = "--Sent with Email All Tabs";
  }
  var selText = document.getElementById("signature");
  selText.value = signature;
}


document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);