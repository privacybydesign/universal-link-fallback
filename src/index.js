import kjua from 'kjua';

document.addEventListener('DOMContentLoaded', function() {
  var sessionPtr;
  try {
  	sessionPtr = JSON.parse(decodeURIComponent(window.location.hash.substr(1)));
  } catch (e) {
  	document.querySelector('#qrcontainer').innerHTML="Invalid session pointer."
  	document.querySelector('#returnbutton').setAttribute("href", "javascript:history.back()");
  	return;
  }
  var returnURL = sessionPtr.returnURL;
  delete sessionPtr.returnURL;

  try {
    var checkURL = new URL(returnURL);
    if (checkURL.protocol != "https" && checkURL.protocol != "http")
      returnURL = null;
  } catch (e) {
    returnURL = null;
  }

  document.querySelector('#qrcontainer').appendChild(kjua({
    text: JSON.stringify(sessionPtr),
    size: 230,
    crisp: false,
  }));

  if (!returnURL)
    returnURL="javascript:history.back()";
  document.querySelector('#returnbutton').setAttribute("href", returnURL);
}, false);
