function loggedIn(){
    return checkCookie();
    
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
function checkCookie() {
    var user=getCookie("stetuser");
    // alert("user="+user);
    if (user != "") {
      // alert("Welcome again " + user);
      return 1;
    } else {
       user = alert("login to give the test");
       return 0;
    }
    return 0;
  }