module.exports = {
	build: {
		options: {
			bundleExec: true,
			sourcemap: 'inline',
			banner: '<%= banner %>'
		},
		files: {
			'<%= pkg.config.styles.unprefixed %>/bundle-noprefix.css': '<%= pkg.config.styles.src %>/styles.scss'
		}
	}
};