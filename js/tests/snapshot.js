require('colors');
var assert = require('assert');
var wd = require('wd');
var wdScreenshot = require('wd-screenshot');
var jsStringEscape = require('js-string-escape')

var testMatrix = require('./testMatrix');

var html = '<div>hi</div>';
var SCREENSHOTS_DIR = __dirname + '/../../screenshots';

wd.configureHttp({
  timeout: 60000,
  retryDelay: 15000,
  retries: 5
});

testMatrix.browsers.forEach(browser => {

  suite('snapshotting ' + browser.browserName, () => {
    var b;
    var allPassed = true;

    suiteSetup(done => {
      b = wd.promiseChainRemote();

      b.on('status', function(info) {
          console.log(info.cyan);
      });
      b.on('command', function(eventType, command, response) {
          console.log(' > ' + eventType.cyan, command, (response || '').grey);
      });
      b.on('http', function(meth, path, data) {
          console.log(' > ' + meth.magenta, path, (data || '').grey);
      });

      b
        .init(browser)
        .nodeify(done);
    });

    suiteTeardown(done => {
      b
        .quit()
        .nodeify(done);
    });

    testMatrix.allTests.filter(t => t.browser === browser).forEach(t => {

      var testName = testMatrix.getTestName(t);
      test(testName, (done) => {
        b
          .get('about:blank')
          .setWindowSize(400, 400)
          .execute('document.body.innerHTML = "' + jsStringEscape(html) + '"')
          .saveScreenshot(SCREENSHOTS_DIR + '/' + testMatrix.getSnapshotName(t) + '.png')
          .nodeify(done);
      });
    });
  });
});
