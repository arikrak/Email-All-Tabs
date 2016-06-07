// Saves options to localStorage.
function save_options() {
  var select = document.getElementById("legacy");
  var legacy = select.children[select.selectedIndex].value;
  localStorage["legacy"] = legacy;

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
  var select = document.getElementById("legacy");
  if(localStorage["legacy"] == "true"){
    select.children[0].selected  = "true";
  }
  else{
    select.children[1].selected = "true";
  }
  var selText = document.getElementById("signature");
  if(localStorage["signature"]) selText.value = localStorage["signature"];
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
