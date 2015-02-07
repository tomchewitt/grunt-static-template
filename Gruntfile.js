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
			},
			"content": {
				src: 		"src/content",
				dist: 		"dist"
			}
		},


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
				files: '<% dir.content.src %>/**',
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
				layoutdir: '<% dir.content.src %>/layouts',
				partials: '<% dir.content.src %>/partials/**/*.{hbs,html}',
				data: '<% dir.content.src %>/data/**/*.json',
				helpers: ['handlebars-helper-partial', '<% dir.content.src %>/helpers/**/*.js']
			},
			build: {
				options: {
					layout: 'default.hbs'
				},
				files: [{
					expand: true,
					cwd: '<% dir.content.dist %>/pages',
					src: '**/*.{hbs,html}',
					dest: '<%= dir.content.dist %>'
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
					cwd: '<% dir.images.src %>',
					src: '**/*.{png,jpg,gif}',
					dest: '<% dir.images.dist %>'
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
			all: ['style', 'script', 'content'],
			options: { logConcurrentOutput: true }
		}
	});


	// #############################################################################
	// TASKS
	// #############################################################################
	grunt.registerTask('default', ['concurrent:all']);
	grunt.registerTask('server', ['connect:server']);
	grunt.registerTask('style', ['compass', 'autoprefixer']);
	grunt.registerTask('script', ['concat', 'uglify:custom']);
	grunt.registerTask('content', ['assemble', 'newer:imagemin']);
};
