var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var path = require('path');

describe('backbone:app', function () {
    it('generate a project', function () {
        // The object returned acts like a promise, so return it to wait until the process is done
        return helpers.run(path.join(__dirname, '../generators/app'))
          .withOptions({ coffee: 'coffee' })      // Mock options passed in
          .withArguments(['name-x'])        // Mock the arguments
          .withPrompts({ name: 'dummy', cool: 'n' }) // Mock the prompt answers
          .then(function() {
            // assert something about the generator
            assert.file(['public/index.html']);
          });
      })
      
  });



