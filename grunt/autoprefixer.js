module.exports = {
	options: {
		browsers: ['last 2 versions', 'ie 9', 'ios 6', 'android 4'],
		map: true
	},
	files: {
		expand: true,
		flatten: true,
		src: '<%= pkg.config.styles.unprefixed %>/bundle-noprefix.css',
		dest: '<%= pkg.config.styles.dist %>/bundle.css'
	}
};