module.exports = function(grunt) {

	// load all grunt tasks matching the `grunt-*` pattern (and assemble)
	require('load-grunt-tasks')(grunt, { pattern: ['grunt-*', 'assemble'] });

	// load in local custom grunt tasks
	grunt.loadTasks('grunt/tasks');

	grunt.initConfig({

		// load in the package.json data
		pkg: grunt.file.readJSON('package.json'),

		// fetch the config from pkg
		buildDir:     '<%= pkg.config.buildDir %>',
		localDevPort: '<%= pkg.config.localDevPort %>',
		environments: '<%= pkg.config.environments %>',

		// declare banner to prepend to files
		banner: [
			'/*!',
			' * Project Name: <%= pkg.name %>',
			' * Author: <%= pkg.author %>',
			' */\n'
		].join('\n'),

		// watch for changes and trigger relevant tasks with livereload
		watch: {
			options: {
				livereload: true
			},
			css: {
				files: '<%= pkg.config.styles.src %>/**',
				tasks: ['sass', 'autoprefixer']
			},
			js: {
				files: '<%= pkg.config.scripts.src %>/**',
				tasks: ['concat', 'uglify']
			},
			html: {
				files: 'src/content/**',
				tasks: 'assemble'
			},
			images: {
				files: '<%= pkg.config.images.src %>/**',
				tasks: ['newer:imagemin:src', 'rsync:images']
			},
			fonts: {
				files: 'src/fonts/**',
				tasks: 'rsync:fonts'
			}
		},

		// sass
		sass: {
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
		},

		// autoprefixer
		autoprefixer: {
			options: {
				browsers: ['last 2 versions', 'ie 9', 'ios 6', 'android 4'],
				map: true
			},
			files: {
				expand: true,
				flatten: true,
				src: '<%= pkg.config.styles.unprefixed %>/bundle-noprefix.css',
				dest: '<%= pkg.config.styles.dist %>/bundle.css'
			},
		},

		// script minification
		uglify: {
			custom: { // our scripts
				files: [{
					cwd: 'src/js',
					src: '*.js',
					dest: '<%= buildDir %>/js'
				}],
				options: {
					banner: '<%= banner %>',
				}
			},
			vendor: { // 3rd party scripts
				files: [{
					cwd: 'src/js/vendor',
					src: '**/*.js',
					dest: '<%= buildDir %>/js'
				}]
			}
		},

		// compile html
		assemble: {
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
		},

		// losslessly compress all images in /src/images
		imagemin: {
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
		},


		// single task for starting server and watching files for changes
		concurrent: {
			dev: ['server', 'watch'],
			options: { logConcurrentOutput: true }
		}
	});

	// standard build task, should be run before commiting
	grunt.registerTask('build', ['sass', 'autoprefixer', 'uglify', 'assemble',
		'newer:imagemin', 'rsync:images', 'rsync:fonts',
		'rsync:downloads']);

	// recompile the microsite from scratch
	grunt.registerTask('rebuild', ['clean', 'rsync:framework', 'build']);

	// run the web server
	grunt.registerTask('server', 'connect:server');

	// register watch and the web server as the default task
	grunt.registerTask('default', ['concurrent:dev']);
};
