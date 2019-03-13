

function launch() {
 chrome.app.window.create('index.html', {
    'outerBounds': {
      'width': 400,
      'height': 650
    },
    "resizable": false,
  });





}

chrome.app.runtime.onLaunched.addListener(launch);