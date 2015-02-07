module.exports = {
	options: {
		livereload: true
	},
	css: {
		files: '<%= pkg.config.styles.src %>/**',
		tasks: ['newer:sass', 'autoprefixer']
	},
	js: {
		files: '<%= pkg.config.scripts.src %>/**',
		tasks: ['newer:concat', 'uglify']
	},
	html: {
		files: 'src/content/**',
		tasks: 'assemble'
	},
	images: {
		files: '<%= pkg.config.images.src %>/**',
		tasks: 'newer:imagemin:src'
	}
};