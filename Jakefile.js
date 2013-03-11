desc('This is the default task.');
task('default', function (params) {
  console.log('This is the default task.');
});

desc('This task runs the test suite.');
task('test', function (params) {
  var command = './node_modules/mocha/bin/mocha';
  jake.exec(command, function () {
    complete(); 
  }, {printStdout: true});
});

desc('Compile LESS down to CSS');
task('less', function(params) {
  var command = './node_modules/less/bin/lessc style.less style.css';
  jake.exec(command, function() {
    console.log('LESS compliled to CSS.');
    complete();
  });
});
