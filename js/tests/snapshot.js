/* @flow */

require('colors');
var _ = require('underscore');
var fs = require('fs');
var wd = require('wd');
var BlinkDiff = require('blink-diff');
var jsStringEscape = require('js-string-escape')
var chai = require('chai');
var invariant = require('invariant');
var tmp = require('tmp');
var Q = require('q');
var chaiAsPromised = require('chai-as-promised');
var findMethod = require('../how/findMethod');

chai.use(chaiAsPromised);
chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

var testMatrix = require('./testMatrix');

function getReferenceFilename(test) {
  var SCREENSHOTS_DIR = __dirname + '/../../screenshots';
  return SCREENSHOTS_DIR + '/' + testMatrix.getSnapshotName(test) + '.png';
}

function getReferenceHTMLFilename(test) {
  var SCREENSHOTS_DIR = __dirname + '/../../screenshots';
  return SCREENSHOTS_DIR + '/' + testMatrix.getSnapshotName(test) + '.html';
}

wd.configureHttp({
  timeout: 60000,
  retryDelay: 15000,
  retries: 5
});

var remoteConfig = undefined;
var browserMappings;
if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
  remoteConfig = {
    hostname: 'ondemand.saucelabs.com',
    port: 80,
    username: process.env.SAUCE_USERNAME,
    accessKey: process.env.SAUCE_ACCESS_KEY,
  };
  browserMappings = testMatrix.sauceLabsBrowserMappings;
} else {
  browserMappings = testMatrix.localBrowserMappings;
}

var isCreatingSnapshots = !!process.env.CREATE_SNAPSHOTS;
var fastTest = !!process.env.FAST_TEST;
var enumerateAllBrowserSupports = !isCreatingSnapshots && !fastTest;
var allTests = testMatrix.generateTestsForSeleniumBrowsers(
  browserMappings,
  enumerateAllBrowserSupports
);

// browser text rendering variances
var SCREENSHOT_TOLERANCE = 0.000003;

var WINDOW_WIDTH = 400;
var WINDOW_HEIGHT = 400;

var css =
'body, html { margin: 0; padding: 0; overflow: hidden; border: 0; }' +
'body { font-size: ' + testMatrix.fontSize + 'px; font-family: arial; }' +
// For some reason, IE screenshots disregard the height of the body if there is
// nothing in it. We need a div to be opaquely white.
'#testOuterDiv { background: white; width: ' + WINDOW_WIDTH + 'px; height: ' + WINDOW_HEIGHT + 'px; }' +
'#content { background: #f00; }' +
'#container { background: #0ff; }';

// http://www.phpied.com/dynamic-script-and-style-elements-in-ie/
var cssJS =
'var ss1 = document.createElement("style");' +
'var def = "' + jsStringEscape(css) + '";' +
'ss1.setAttribute("type", "text/css");' +
'var hh1 = document.getElementsByTagName("head")[0];' +
'hh1.appendChild(ss1);' +
'if (ss1.styleSheet) {' /*IE*/ +
'  ss1.styleSheet.cssText = def;' +
'} else {' /* errbody else */ +
'  var tt1 = document.createTextNode(def);' +
'  ss1.appendChild(tt1);' +
'}';

allTests.forEach(seleniumTests => {

  var browser = seleniumTests.seleniumBrowser;
  var tests = seleniumTests.tests;

  global.suite('using ' + browser.getDisplayName(), () => {
    var b;
    var allPassed = true;

    global.suiteSetup(done => {
      b = wd.promiseChainRemote(remoteConfig);

      if (process.env.SNAPSHOT_DEBUG) {
        b.on('status', function(info) {
            console.log(info.cyan);
        });
        b.on('command', function(eventType, command, response) {
            console.log(' > ' + eventType.cyan, command, (response || '').grey);
        });
        b.on('http', function(meth, path, data) {
            console.log(' > ' + meth.magenta, path, (data || '').grey);
        });
      }

      b
        .init(browser.toSeleniumJSON())
        .setWindowSize(WINDOW_WIDTH, WINDOW_HEIGHT)
        .elementByTagName('html')
        .getSize()
        .then(size => {
          invariant(b, 'flow');
          // Browser titles/bars short change you, so set it so the document's
          // 400x400.
          return b.setWindowSize(WINDOW_WIDTH + (WINDOW_WIDTH - size.width), WINDOW_HEIGHT + (WINDOW_HEIGHT - size.height));
        })
        .nodeify(done);
    });

    global.suiteTeardown(done => {
      invariant(b, 'flow');
      b
        .quit()
        .nodeify(done);
    });

    global.setup(done => {
      invariant(b, 'flow');
      b
        .get(browser.startingPage)
        .nodeify(done);
    });

    tests.forEach(t => {
      var testName = testMatrix.getTestName(t);
      var mochaTestName =
        (isCreatingSnapshots ? 'Snapshot ' : 'Compare snapshot ') + testName;

      global.test(mochaTestName, (done) => {
        var method = findMethod(t.content, t.container, t.horizontal, t.vertical, t.browserSupport);
        invariant(method, 'flow');
        method.addIDs();
        var html = method.getCode(t.content, t.container, t.horizontal, t.vertical, t.browserSupport);
        invariant(b, 'flow');
        var insertJS =
          'document.body.innerHTML = "' + jsStringEscape('<div id="testOuterDiv">' + html + '</div>') + '";';
        var res =
          b.execute(cssJS + insertJS);

        var referenceFilename = getReferenceFilename(t);
        if (isCreatingSnapshots) {
          res = res.saveScreenshot(referenceFilename);
          fs.writeFileSync(getReferenceHTMLFilename(t), css + html);
        } else {
          var tmpFilename = tmp.tmpNameSync({
            // for finding it easier in Finder
            prefix: 'screenshot-' + Date.now() + '-' + testName + '-',
            postfix: '.png',
          });
          res = res
            .saveScreenshot(tmpFilename)
            .then(() => {
              var blinkDiff = new BlinkDiff({
                imageAPath: referenceFilename,
                imageBPath: tmpFilename,
                thresholdType: BlinkDiff.THRESHOLD_PERCENT,
              });
              return Q.ninvoke(blinkDiff, 'run');
            })
            .then(result => {
              var diff = result.differences / result.dimension;
              var pass = diff < SCREENSHOT_TOLERANCE;
              var deferred = Q.defer();
              if (pass) {
                fs.unlinkSync(tmpFilename);
                deferred.resolve(diff);
              } else {
                deferred.reject(
                  tmpFilename +
                  ' is not equal to reference ' +
                  referenceFilename +
                  ', diff: ' + diff +
                  ', tolerance: ' + SCREENSHOT_TOLERANCE
                );
              }
              return deferred.promise;
            });
        }
        res.nodeify(done);
      });
    });
  });
});
