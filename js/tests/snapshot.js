/* @flow */

require('colors');
var _ = require('underscore');
var fs = require('fs');
var wd = require('wd');
var wdScreenshot = require('wd-screenshot')({
  tolerance: 0.003, // browser text rendering variances
});
var jsStringEscape = require('js-string-escape')
var chai = require('chai');
var invariant = require('invariant');
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
wdScreenshot.addFunctions(wd);

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

var css = '<style>' +
'body, html { margin: 0; padding: 0; }' +
'body { font-size: ' + testMatrix.fontSize + 'px; font-family: arial; }' +
'#content { background: #f00; }' +
'#container { background: #0ff; }' +
'</style>';

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
        .setWindowSize(400, 400)
        .elementByTagName('html')
        .getSize()
        .then(size => {
          invariant(b, 'flow');
          // Browser titles/bars short change you, so set it so the document's
          // 400x400.
          return b.setWindowSize(400 + (400 - size.width), 400 + (400 - size.height));
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
        .get('about:blank')
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
        var res =
          b.execute('document.body.innerHTML = "' + jsStringEscape(css + html) + '"');

        if (isCreatingSnapshots) {
          res = res.saveScreenshot(getReferenceFilename(t));
          fs.writeFileSync(getReferenceHTMLFilename(t), css + html);
        } else {
          res = res.compareWithReferenceScreenshot(getReferenceFilename(t));
        }
        res.nodeify(done);
      });
    });
  });
});
