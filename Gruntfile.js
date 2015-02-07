module.exports = function(grunt) {

	// LOAD IN ALL TASKS
	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt, { pattern: ['grunt-*', 'assemble'] });
	grunt.loadTasks('grunt/tasks');

	// INIT GRUNT CONFIG
	grunt.initConfig({

		// READ IN PACKAGE.JSON
		pkg: grunt.file.readJSON('package.json'),

		// BANNER
		banner: [
			'/*!',
			' * Project Name: <%= pkg.name %>',
			' * Author: <%= pkg.author %>',
			' */\n'
		].join('\n'),


		// #############################################################################
		// VARIABLES
		// #############################################################################
		
		dir: {
			"styles": {
				src: 		"src/asset/sass",
				unprefixed: "src/asset/css",
				dist: 		"dist/asset/css"
			},
			"scripts": {
				src: 		"src/asset/js",
				dist: 		"dist/asset/js"
			},
			"images": {
				src: 		"src/asset/img",
				dist: 		"dist/asset/img"
			}
		}


		// #############################################################################
		// WATCH
		// #############################################################################
		
		watch: {
			options: {
				livereload: true
			},
			css: {
				files: '<%= dir.styles.src %>/**',
				tasks: ['compass', 'autoprefixer']
			},
			js: {
				files: '<%= dir.scripts.src %>/**',
				tasks: ['concat', 'uglify']
			},
			html: {
				files: 'src/content/**',
				tasks: ['assemble']
			},
			images: {
				files: '<%= dir.images.src %>/**',
				tasks: ['newer:imagemin:src']
			}
		},


		// #############################################################################
		// STYLES
		// #############################################################################

		// COMPASS
		compass: {
			build: {
				options: {
					sourcemap: true,
					banner: '<%= banner %>',
					specify: '<%= dir.styles.src %>/bundle-noprefix.scss',
					sassDir: '<%= dir.styles.src %>',
					cssDir: '<%= dir.styles.unprefixed %>',
					environment: 'production',
					outputStyle: 'compressed'
				}
			}
		},

		// AUTOPREFIXER
		autoprefixer: {
			options: {
				browsers: ['last 2 versions', 'ie 9', 'ios 6', 'android 4'],
				map: true
			},
			files: {
				flatten: true,
				src: '<%= dir.styles.unprefixed %>/bundle-noprefix.css',
				dest: '<%= dir.styles.dist %>/bundle.css'
			},
		},



		// #############################################################################
		// SCRIPTS
		// #############################################################################

		// CONCAT
		concat: {
			dist: {
				src: [
					'<%= dir.scripts.src %>/**/*.js'
					],
				dest: '<%= dir.scripts.dist %>/bundle.js'
			}
		},

		// UGLIFY
		uglify: {
			custom: { // our scripts
				files: [{
					src: '<%= dir.scripts.dist %>/bundle.js',
					dest: '<%= dir.scripts.dist %>/bundle.min.js'
				}],
				options: {
					banner: '<%= banner %>',
				}
			},
			vendor: { // 3rd party scripts
				files: [{
					src: '<%= dir.scripts.src %>/**/*.js',
					dest: '<%= dir.scripts.src %>'
				}]
			}
		},


		// #############################################################################
		// HTML
		// #############################################################################

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


		// #############################################################################
		// IMAGES
		// #############################################################################

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


		// #############################################################################
		// SERVER
		// #############################################################################

		connect: {
			server: {
				options: {
					port: '<%= localDevPort %>',
					keepalive: true,
					open: {
						target: 'http://localhost:<%= localDevPort %>'
					}
				}
			}
		},


		// #############################################################################
		// CONCURRENT
		// #############################################################################

		concurrent: {
			dev: ['server', 'watch'],
			options: { logConcurrentOutput: true }
		}
	});


	// #############################################################################
	// TASKS
	// #############################################################################
	grunt.registerTask('build', ['compass', 'autoprefixer', 'uglify', 'assemble',
		'newer:imagemin', 'rsync:images', 'rsync:fonts',
		'rsync:downloads']);

	// run the web server
	grunt.registerTask('server', 'connect:server');

	// register watch and the web server as the default task
	grunt.registerTask('default', ['concurrent:dev']);

	// register watch and the web server as the default task
	grunt.registerTask('style', ['compass', 'autoprefixer']);
};
