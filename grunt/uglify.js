module.exports = {
	custom: { // our scripts
		files: [{
			src: '<%= pkg.config.scripts.src %>/build.js',
			dest: '<%= pkg.config.scripts.dest %>/bundle.js'
		}],
		options: {
			banner: '<%= banner %>',
		}
	}
	// vendor: { // 3rd party scripts
	// 	files: [{
	// 		cwd: 'src/js/vendor',
	// 		src: '**/*.js',
	// 		dest: '<%= buildDir %>/js'
	// 	}]
	// }
};