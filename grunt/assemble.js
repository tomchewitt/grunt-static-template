module.exports = {
	options: {
		layoutdir: 'src/content/layouts',
		partials: 'src/content/partials/**/*.{hbs,html}',
		data: 'src/content/data/**/*.json',
		helpers: ['handlebars-helper-partial', 'src/content/helpers/**/*.js']
	},
	build: {
		options: {
			layout: 'default.hbs'
		},
		files: [{
			expand: true,
			cwd: 'src/content/pages',
			src: '**/*.{hbs,html}',
			dest: '<%= buildDir %>'
		}]
	}
};