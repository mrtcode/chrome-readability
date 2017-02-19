var fs = require('fs');
var cri = require('chrome-remote-interface');

// Readability.js will be injected on page load
function loadReadabilityScript(callback) {
  fs.readFile(__dirname + '/Readability.js', function (err, data) {
    if (err) {
      return callback(err);
    }
    var script = data.toString();
    callback(null, script);
  });
}

function runReadability(instance, callback) {

  // the code below will be converted to string and injected into the chrome instance
  var injection = function () {
    // *** BROWSER CODE BEGINS***
    var location = document.location;
    var uri = {
      spec: location.href,
      host: location.host,
      prePath: location.protocol + "//" + location.host, // TODO This is incomplete, needs username/password and port
      scheme: location.protocol.substr(0, location.protocol.indexOf(":")),
      pathBase: location.protocol + "//" + location.host + location.pathname.substr(0, location.pathname.lastIndexOf("/") + 1)
    };

    var readabilityObj = new Readability(uri, document);
    var result = readabilityObj.parse();

    if (result) {
      document.body.innerHTML = result.content;
      return JSON.stringify(result);
    } else {
      return 0;
    }
    // *** BROWSER CODE ENDS ***
  };

  instance.Runtime.evaluate({'expression': "(" + injection.toString() + ")()"}, function (err, result) {

    if (result.result.value) {
      var article = JSON.parse(result.result.value);
      callback(null, article);
    } else {
      callback(err);
    }

    instance.close();
  });
}

function extract(url, options, callback) {
  if (typeof options === 'function') callback = options;

  cri(function (instance) {
    instance.Network.enable();
    if (options.userAgent) {
      instance.Network.setUserAgentOverride({'userAgent': options.userAgent});
    }

    loadReadabilityScript(function (err, script) {
      if (err) return callback(err);
      instance.Page.addScriptToEvaluateOnLoad({'scriptSource': script});
    });

    instance.Page.domContentEventFired(runReadability.bind(null, instance, callback));
    instance.Page.enable();
    instance.once('ready', function () {
      instance.Page.navigate({url: url});
    });

  });
}

exports.extract = extract;