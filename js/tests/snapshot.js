/* @flow */

require('colors');
var _ = require('underscore');
var fs = require('fs');
var wd = require('wd');
var BlinkDiff = require('blink-diff');
var PNGImage = require('pngjs-image');
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
var selenium = require('./selenium');

function getReferenceFilename(test) {
  var SCREENSHOTS_DIR = __dirname + '/../../screenshots';
  return SCREENSHOTS_DIR + '/' + testMatrix.getSnapshotName(test) + '.png';
}

function getReferenceTestHTMLFilename(test) {
  var SCREENSHOTS_DIR = __dirname + '/../../screenshots';
  return SCREENSHOTS_DIR + '/' + testMatrix.getTestName(test) + '_test.html';
}

function getReferenceCodeFilename(test) {
  var SCREENSHOTS_DIR = __dirname + '/../../screenshots';
  return SCREENSHOTS_DIR + '/' + testMatrix.getTestName(test) + '.txt';
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
  browserMappings = selenium.sauceLabsBrowserMappings;
} else {
  browserMappings = selenium.localBrowserMappings;
}

var isCreatingSnapshots = !!process.env.CREATE_SNAPSHOTS;
var allTests = testMatrix.generateTestsForSeleniumBrowsers(
  browserMappings
);

// browser text rendering variances
var SCREENSHOT_TOLERANCE = 0.000003;

var WINDOW_WIDTH = 400;
var WINDOW_HEIGHT = 400;

var css =
'body, html { margin: 0; padding: 0; overflow: hidden; border: 0; }' +
'body { font-family: arial; }' +
// The container sizing will get overridden if the options specify it.
'#content { background: #f00; width: 25px; height: 25px; }' +
'#container { background: #0ff; width: 300px; height: 300px; }';

var fontSizeCSS =
'body { font-size: ' + testMatrix.fontSize + 'px; }' +
// By default, the browser has a 1.1-1.2em of line-height. This makes
// calculating vertical centering different across methods.
// TODO - this needs to be exposed as a notice to the user, or baked into the
// code the method generates.
'#content, #container { line-height: 1em; }' +
'#content { background: 0 !important; }' +
// The content sizing will get overridden if the method specifies it.
'#content { width: auto; height: auto; }';

function getOuterDivCSS(width, height) {
  // For some reason, IE screenshots disregard the height of the body if there is
  // nothing in it. We need a div to be opaquely white.
  return '#testOuterDiv { background: white; width: ' + width + 'px; height: ' + height + 'px;}';
}

// http://www.phpied.com/dynamic-script-and-style-elements-in-ie/
function getJStoInjectCSS(css: string) {
  return (
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
    '}'
  );
}

var useBrowser = isCreatingSnapshots || remoteConfig;

allTests.forEach(seleniumTests => {

  var browser = seleniumTests.seleniumBrowser;
  var tests = seleniumTests.tests;

  global.suite('using ' + browser.getDisplayName(), () => {
    var b;
    var allPassed = true;
    var windowWidth = WINDOW_WIDTH + browser.cropBoundary.addX;
    var windowHeight = WINDOW_HEIGHT + browser.cropBoundary.addY;

    global.suiteSetup(done => {
      if (!useBrowser) {
        done();
        return;
      }

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
        .setWindowSize(windowWidth, windowHeight)
        .elementByTagName('html')
        .getSize()
        .then(size => {
          invariant(b, 'flow');
          // Browser titles/bars short change you, so set it so the document's
          // 400x400.
          return b.setWindowSize(windowWidth + (windowWidth - size.width), windowHeight + (windowHeight - size.height));
        })
        .nodeify(done);
    });

    global.suiteTeardown(done => {
      if (!b) {
        done();
        return;
      }

      b
        .quit()
        .nodeify(done);
    });

    global.setup(done => {
      if (!b) {
        done();
        return;
      }
      b
        // Get all the browsers to render in as much standards mode as possible.
        .get('http://dump.oliverzheng.com/doctype_html5.html')
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
        method.setIsTest();
        var html = method.getCode(t.content, t.container, t.horizontal, t.vertical, t.browserSupport);
        var canonicalCode = method.getCanonicalCode(t.content, t.container, t.horizontal, t.vertical, t.browserSupport);

        var codeGenerated = canonicalCode.html;
        if (canonicalCode.parentCSS) {
          codeGenerated += '\n\n#parent {\n' + canonicalCode.parentCSS + '\n}';
        }
        if (canonicalCode.middleCSS) {
          codeGenerated += '\n\n#middle {\n' + canonicalCode.middleCSS + '\n}';
        }
        if (canonicalCode.childCSS) {
          codeGenerated += '\n\n#child {\n' + canonicalCode.childCSS + '\n}';
        }

        if (!useBrowser) {
          // We only don't use the browser if we are comparing generated code
          var referenceCode = fs.readFileSync(getReferenceCodeFilename(t), 'utf8');
          if (referenceCode !== codeGenerated) {
            done('Reference code not equal to code generated: ' + codeGenerated);
          } else {
            done();
          }
          return;
        }

        var cssToInject = css;
        if (t.content.text) {
          cssToInject += fontSizeCSS;
        }

        cssToInject += getOuterDivCSS(windowWidth, windowHeight);
        if (isCreatingSnapshots) {
          fs.writeFileSync(getReferenceCodeFilename(t), codeGenerated);
        }
        fs.writeFileSync(getReferenceTestHTMLFilename(t), '<style>' + cssToInject + '</style>' + html);

        invariant(b, 'flow');
        var insertJS =
          'document.body.innerHTML = "' + jsStringEscape('<div id="testOuterDiv">' + html + '</div>') + '";';
        // In quirksmode, IE's box model stretches the height to fit the
        // font-size. We could set 'overflow:hidden' to it, but it could mess
        // with the actual generated code. So let's conditionally add font size
        // when we need it.
        var res =
          b.execute(getJStoInjectCSS(cssToInject) + insertJS);

        var referenceFilename = getReferenceFilename(t);
        if (isCreatingSnapshots && !fs.existsSync(referenceFilename)) {
          // Write the image for the first, compare all the ones after it to
          // this.
          res = res.saveScreenshot(referenceFilename);
        } else {
          var tmpFilename = tmp.tmpNameSync({
            // for finding it easier in Finder
            prefix: 'screenshot-' + Date.now() + '-' + testName + '-',
            postfix: '.png',
          });
          res = res
            .saveScreenshot(tmpFilename)
            .then(() => {
              tmpFilename
              var blinkDiffOptions = {};
              blinkDiffOptions.imageAPath = referenceFilename;
              blinkDiffOptions.thresholdType = BlinkDiff.THRESHOLD_PERCENT;
              if (browser.hasCropBoundary()) {
                var image = PNGImage.readImageSync(tmpFilename);
                image.clip(
                  browser.cropBoundary.cropX,
                  browser.cropBoundary.cropY,
                  WINDOW_WIDTH,
                  WINDOW_HEIGHT
                );
                blinkDiffOptions.imageB = image;
              } else {
                blinkDiffOptions.imageBPath = tmpFilename;
              }
              var blinkDiff = new BlinkDiff(blinkDiffOptions);
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
