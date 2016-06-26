// Run a visual regression test on visualize.html
var htmlPath = "http://localhost:8003/visualize.html"

var fs = require('fs');
var path = fs.absolute(fs.workingDirectory + '/phantomcss.js');
var phantomcss = require(path);

casper.test.begin('Testing ' + htmlPath, function (test) {
  // boring setup code taken from PhantomCSS demo
  phantomcss.init({
    rebase: casper.cli.get( "rebase" ),
    // SlimerJS needs explicit knowledge of this Casper, and lots of absolute paths
    casper: casper,
    libraryRoot: fs.absolute( fs.workingDirectory + '' ),
    screenshotRoot: fs.absolute( fs.workingDirectory + '/screenshots' ),
    failedComparisonsRoot: fs.absolute( fs.workingDirectory + '/demo/failures' ),
    addLabelToFailedImage: false,
  });

  casper.on('remote.message', function(msg) {this.echo(msg);});
  casper.on('error', function (err) {this.die( "PhantomJS has errored: " + err );});
  casper.on('resource.error', function (err) {casper.log( 'Resource load error: ' + err, 'warning' );});


  // start with a baseline image
  casper.start(htmlPath);
  casper.viewport(1440, 900, function () {
    phantomcss.screenshot('#pyInputPane', 'pyInputPane');
  });

  // click on one example code for each language
  casper.then(function() {
    casper.click("#aliasExampleLink");
    phantomcss.screenshot('#pyInputPane', 'pyInputPane');
  });

  casper.then(function() {
    casper.click("#tortureLink");
    phantomcss.screenshot('#pyInputPane', 'pyInputPane');
  });

  casper.then(function() {
    casper.click("#javaVarLink");
    phantomcss.screenshot('#pyInputPane', 'pyInputPane');
  });

  casper.then(function() {
    casper.click("#jsDatatypesExLink");
    phantomcss.screenshot('#pyInputPane', 'pyInputPane');
  });

  casper.then(function() {
    casper.click("#tsGreeterExLink");
    phantomcss.screenshot('#pyInputPane', 'pyInputPane');
  });

  casper.then(function() {
    casper.click("#rubyConstantsLink");
    phantomcss.screenshot('#pyInputPane', 'pyInputPane');
  });

  casper.then(function() {
    casper.click("#cMengThesisLink");
    phantomcss.screenshot('#pyInputPane', 'pyInputPane');
  });

  casper.then(function() {
    casper.click("#cppFirstLink");
    phantomcss.screenshot('#pyInputPane', 'pyInputPane');
  });


  // now test the visualize mode:
  casper.then(function() {
    casper.click("#aliasExampleLink");
    // brief wait for code to load
    this.wait(250, function() {
      casper.click("#executeBtn");
    });
  });

  // after clicking on executeBtn, wait for the dataViz div to appear
  // because that means the visualizer has rendered:
  casper.waitFor(function check() {
    return this.evaluate(function() {
      return document.querySelectorAll("#dataViz").length > 0;
    });
  }, function then() {
    phantomcss.screenshot('.visualizer', 'visualizer');
  });

  // this example has 31 steps:
  for (var i = 0; i < 31; i++) {
    casper.then(function() {
      casper.click("#jmpStepFwd");
      // slight pause for vis to settle
      this.wait(200, function() {
        phantomcss.screenshot('.visualizer', 'visualizer');
      });
    });
  }

  // for the remaining examples, be brief and take only a snapshot of
  // the FINAL state of the visualization


  // test instruction limit reached
  casper.then(function() {
    casper.click("#genPrimesLink");
    // brief wait for code to load
    this.wait(250, function() {
      casper.click("#executeBtn");

      casper.waitFor(function check() {
        return this.evaluate(function() {
          return document.querySelectorAll("#dataViz").length > 0;
        });
      }, function then() {
        casper.click('#jmpLastInstr');
        // slight pause for vis to settle
        this.wait(200, function() {
          phantomcss.screenshot('.visualizer', 'visualizer_instr_limit_reached');
        });
      });
    });
  });

  // test exception
  casper.then(function() {
    casper.click("#pwTryFinallyLink");
    // brief wait for code to load
    this.wait(250, function() {
      casper.click("#executeBtn");

      casper.waitFor(function check() {
        return this.evaluate(function() {
          return document.querySelectorAll("#dataViz").length > 0;
        });
      }, function then() {
        casper.click('#jmpLastInstr');
        // slight pause for vis to settle
        this.wait(200, function() {
          phantomcss.screenshot('.visualizer', 'visualizer_exception');
        });
      });
    });
  });


  // for these examples, just snapshot dataViz to be even briefer:
  var exampleTestLinks = ['#tutorialExampleLink', '#ll2Link', '#inheritanceExampleLink', '#aliasing2Link', '#aliasing3Link', '#aliasing7Link', '#closure5Link'];

  exampleTestLinks.forEach(function(e, i) {
    // reset all toggles to test regular visualizer
    casper.thenEvaluate(function() {
      document.querySelector('#cumulativeModeSelector').value = "false";
      document.querySelector('#heapPrimitivesSelector').value = "false";
      document.querySelector('#textualMemoryLabelsSelector').value = "false";
    });

    casper.wait(250, function() {
      casper.click(e);
      // brief wait for code to load
      this.wait(250, function() {
        casper.click("#executeBtn");

        casper.waitFor(function check() {
          return this.evaluate(function() {
            return document.querySelectorAll("#dataViz").length > 0;
          });
        }, function then() {
          casper.click('#jmpLastInstr');
          // slight pause for vis to settle
          this.wait(200, function() {
            phantomcss.screenshot('#dataViz', 'dataViz' + e);
          });
        });
      });
    });


    // simulate what's done for composingprograms
    casper.thenEvaluate(function() {
      document.querySelector('#cumulativeModeSelector').value = "true";
      document.querySelector('#heapPrimitivesSelector').value = "false";
      document.querySelector('#textualMemoryLabelsSelector').value = "false";
    });

    casper.wait(250, function() {
      casper.click(e);
      // brief wait for code to load
      this.wait(250, function() {
        casper.click("#executeBtn");
        casper.waitFor(function check() {
          return this.evaluate(function() {
            return document.querySelectorAll("#dataViz").length > 0;
          });
        }, function then() {
          casper.click('#jmpLastInstr');
          // slight pause for vis to settle
          this.wait(200, function() {
            phantomcss.screenshot('#dataViz', 'dataViz_CUMULATIVE_' + e);
          });
        });
      });
    });


    // simulate what's done for csc108h
    casper.thenEvaluate(function() {
      document.querySelector('#cumulativeModeSelector').value = "false";
      document.querySelector('#heapPrimitivesSelector').value = "true";
      document.querySelector('#textualMemoryLabelsSelector').value = "true";
    });

    casper.wait(250, function() {
      casper.click(e);
      // brief wait for code to load
      this.wait(250, function() {
        casper.click("#executeBtn");
        casper.waitFor(function check() {
          return this.evaluate(function() {
            return document.querySelectorAll("#dataViz").length > 0;
          });
        }, function then() {
          casper.click('#jmpLastInstr');
          // slight pause for vis to settle
          this.wait(200, function() {
            phantomcss.screenshot('#dataViz', 'dataViz_TEXTLABELS_' + e);
          });
        });
      });
    });

  }); // end forEach


  // run all tests:
  casper.then(function now_check_the_screenshots() {
    phantomcss.compareAll(); // compare screenshots
  });

  casper.run(function() {
    //phantomcss.getExitStatus() // pass or fail?
    casper.test.done();
  });
});
