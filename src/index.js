import kjua from 'kjua';
import userAgent from './user_agent';

document.addEventListener('DOMContentLoaded', function() {
  let rawSessionPtr = window.location.hash.substr(1);
  var sessionPtr;
  try {
  	sessionPtr = JSON.parse(decodeURIComponent(rawSessionPtr));
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

  // In Android (mainly when using the Firefox app) intent:// urls are not always properly opened.
  // Therefore we try to open the irma:// url here. The behaviour is void when the IRMA app is not installed.
  if (userAgent() == "Android")
    document.querySelector("#fallback-irma-launcher").src = `irma://qr/json/${rawSessionPtr}`;
}, false);
