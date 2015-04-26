require('colors');
var assert = require('assert');
var wd = require('wd');
var wdScreenshot = require('wd-screenshot')({
  tolerance: 0,
});
var jsStringEscape = require('js-string-escape')
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

var testMatrix = require('./testMatrix');

var html = '<div>hi</div>';
var SCREENSHOTS_DIR = __dirname + '/../../screenshots';

wd.configureHttp({
  timeout: 60000,
  retryDelay: 15000,
  retries: 5
});
wdScreenshot.addFunctions(wd);

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

    setup(done => {
      b
        .get('about:blank')
        .setWindowSize(400, 400)
        .nodeify(done);
    });

    // Create snapshot
    testMatrix.allTests.filter(t => t.browser === browser).forEach(t => {
      var testName = testMatrix.getTestName(t);
      test.skip('Snapshot ' + testName, (done) => {
        b
          .execute('document.body.innerHTML = "' + jsStringEscape(html) + '"')
          .saveScreenshot(SCREENSHOTS_DIR + '/' + testMatrix.getSnapshotName(t) + '.png')
          .nodeify(done);
      });
    });

    // Compare snapshots
    testMatrix.allTests.filter(t => t.browser === browser).forEach(t => {
      var testName = testMatrix.getTestName(t);
      test('Compare snapshot ' + testName, (done) => {
        b
          .execute('document.body.innerHTML = "' + jsStringEscape(html) + '"')
          .compareWithReferenceScreenshot(SCREENSHOTS_DIR + '/' + testMatrix.getSnapshotName(t) + '.png')
          .nodeify(done);
      });
    });
  });
});
