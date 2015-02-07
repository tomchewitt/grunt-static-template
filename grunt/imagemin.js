module.exports = {
	src: {
		options: {
			optimizationLevel: 7,
			progressive: true,
			interlaced: true
		},
		files: [{
			expand: true,
			cwd: 'src/images/',
			src: '**/*.{png,jpg,gif}',
			dest: 'src/images/'
		}]
	}
};