module.exports = function(grunt) {
  	require('time-grunt')(grunt);
  	require('load-grunt-config')(grunt, { pattern: ['grunt-*', 'assemble'] });
  	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
	});
};
