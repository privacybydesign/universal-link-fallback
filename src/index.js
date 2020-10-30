import irma from '@privacybydesign/irma-frontend';
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

  if (!returnURL)
    returnURL="javascript:history.back()";
  document.querySelector('#returnbutton').setAttribute("href", returnURL);

  irma.newWeb({
    debugging: true,
    language: "en",
    element: "#qrcontainer",
    session: {
      start: false,
      mapping: {
        sessionPtr: () => sessionPtr
      },
      result: false
    }
  }).start().then(() => setTimeout(() => {
    // After session is succeeded, try to go back automatically.
    document.querySelector("#returnbutton").click();
  }, 2000));

  // In the Firefox app on Android intent:// urls are not properly opened.
  // Therefore we try to open the irma:// url here. The behaviour is void when the IRMA app is not installed.
  if (userAgent() == "Android-Firefox")
    document.querySelector("#fallback-irma-launcher").src = `irma://qr/json/${rawSessionPtr}`;
}, false);
