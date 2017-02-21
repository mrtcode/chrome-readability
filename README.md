# Extract online articles with Readability and headless Chrome

A simple tool that:
1. Attaches to a running Chrome instance
2. Navigates to a given url
3. Injects Readbility.js
4. Waits until a website loads
5. Runs Readability and returns an extracted article

Headless mode allows much simpler Chrome integration in a server environment and gives Chrome speed and reliability for various web automation tools.

[Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/) is still under development therefore this guide can change.

This tool uses [Chrome Debugging Protocol](https://developer.chrome.com/devtools/docs/debugger-protocol) to control a Chrome instance.

## For Linux

Install Chrome from a development channel (until headless mode appears in a stable chrome version):

https://www.google.com/chrome/browser/?platform=linux&extra=devchannel

Headless Chrome isn't executed automatically, because it's more reliable to run and manage its process separately.

> google-chrome-unstable --headless --user-data-dir=/tmp/chrome-new-data --remote-debugging-port=9222

> git clone https://github.com/mrtcode/chrome-readability

```js
var chromeReadability = require('./chrome-readability');

var url = 'https://www.wsj.com/articles/trump-weighs-travel-ban-that-allows-in-green-card-holders-ensures-those-in-transit-aren-t-caught-in-system-1487438347';

chromeReadability.extract(url, function(err, article) {
    console.log(article.content);
});
```


## Limitations:

1. Unlike the normal Chrome mode, the headless mode currently supports only one tab per instance, it means to use this script in parallel more instances on different ports must be executed.














