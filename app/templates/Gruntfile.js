'use strict';

module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({

		config: {
			src: 'src',
			dist: 'dist',
			tmp: '.tmp'
		},

		watch: {
			assemble: {
				files: ['<%= config.src %>/{content-,data,templates}/{,*/}/{,*/}/*.{md,hbs,yml}'],
				tasks: ['assemble']
			},
			sass : {
				files: ['<%= config.src %>/assets/scss/{,*/}*.{scss,css}'],
				tasks: ['sass:server']
			},
			css : {
				files: ['<%= config.tmp %>/assets/css/{,*/}*.css']
			},
			img : {
				files: ['<%= config.src %>/assets/images/*.{jpg,jpeg,png,gif}'],
				tasks: ['imagemin:server']
			},
			js : {
				files: ['<%= config.src %>/assets/js/*.js'],
				tasks: ['copy:serverjs']
			}
		},

		browserSync: {
			dev: {
				bsFiles: {
					src : [
						"<%= config.tmp %>/{,*/}*.html",
						"<%= config.tmp %>/assets/css/{,*/}*.css",
						"<%= config.src %>/assets/{,*/}*"
					]
				},
				options: {
					watchTask: true,
					server: {
						port: 3000,
						baseDir: ["<%= config.tmp %>","./"]
					}
				}
			}
		},

		sass: {
			options: {
				loadPath: [
					'bower_components'
				]
			},
			server: {
				files: [{
					expand: true,
					cwd: '<%= config.src %>/assets/scss',
					src: ['*.scss'],
					dest: '<%= config.tmp %>/assets/css',
					ext: '.css'
				}]
			},
			build: {
				options:{
					style: 'compressed'
				},
				files: [{
					expand: true,
					cwd: '<%= config.src %>/assets/scss',
					src: ['*.scss'],
					dest: '<%= config.dist %>/assets/css',
					ext: '.css'
				}]
			}
		},

		'sass-convert': {
			options: {

			},
			files: {
				src: ['<%= config.src %>/assets/scss/{,*/}*.{scss,css}']
			}
		},

		assemble: {
			pages: {
				options: {
					flatten: true,
					assets: '<%= config.dist %>/assets',
					layout: '<%= config.src %>/templates/layouts/default.hbs',
					data: '<%= config.src %>/data/*.{json,yml}',
					partials: '<%= config.src %>/templates/partials/*.hbs'
				},
				files: {
					'<%= config.tmp %>/': ['<%= config.src %>/templates/pages/{,*/}/*.hbs']
				}
			}
		},

		useminPrepare: {
			options: {
				dest: '<%= config.dist %>'
			},
			html: '<%= config.tmp %>/index.html',
			css: '<%= config.tmp %>/assets/css/app.css'
		},

		usemin: {
			options: {
				assetsDirs: ['<%= config.tmp %>','bower_components']
			},
			html: ['<%= config.tmp %>/{,*/}*.html'],
			css: ['<%= config.tmp %>/assets/css/*.css']
		},

		imagemin: {
			server: {
				files: [{
					expand: true,
					cwd: '<%= config.src %>/assets/img/',
					src: '{,*/}*.{gif,jpeg,jpg,png}',
					dest: '<%= config.tmp %>/assets/img/'
				}]
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.src %>/assets/images',
					src: '{,*/}*.{gif,jpeg,jpg,png}',
					dest: '<%= config.dist %>/assets/images'
				}]
			}
		},

		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/assets/images',
					src: '{,*/}*.svg',
					dest: '<%= config.dist %>/assets/images'
				}]
			}
		},

		htmlmin: {
			dist: {
				options: {
					collapseBooleanAttributes: false,
					collapseWhitespace: false,
					removeAttributeQuotes: false,
					removeCommentsFromCDATA: false,
					removeEmptyAttributes: false,
					removeOptionalTags: false,
					removeRedundantAttributes: false,
					useShortDoctype: false
				},
				files: [{
					expand: true,
					cwd: '<%= config.tmp %>',
					src: '{,*/}*.html',
					dest: '<%= config.dist %>'
				}]
			}
		},

		autoprefixer: {
			options: {
				browsers: ['last 1 version']
			},
            server:{

            },
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.tmp %>/styles/',
					src: '{,*/}*.css',
					dest: '<%= config.dist %>/styles/'
				}]
			}
		},

		modernizr: {
			dist: {
				devFile: 'bower_components/modernizr/modernizr.js',
				outputFile: '<%= config.dist %>/assets/js/vendor/modernizr.js',
				files: {
					src: [
						'<%= config.dist %>/assets/js/{,*/}*.js',
						'<%= config.dist %>/assets/css/{,*/}*.css',
						'!<%= config.dist %>/assets/js/vendor/*'
					]
				},
				uglify: true
			}
		},

		copy: {
			server: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= config.src %>',
					dest: '<%= config.tmp %>',
					src: [
						'*.{ico,png,jpg,txt}',
						'.htaccess',
						'assets/fonts/{,*/}*.*',
						'assets/js/{,*/}*.js']
				}]
			},
            serverjs: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.src %>',
                    dest: '<%= config.tmp %>',
                    src: [
                        'assets/js/{,*/}*.js']
                }]
            },
			build: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= config.src %>',
					dest: '<%= config.dist %>',
					src: [
						'*.{ico,png,jpg,txt}',
						'.htaccess',
						'assets/fonts/{,*/}*.*']
				}]
			}
		},

		clean: ['<%= config.dist %>','<%= config.tmp %>'],

		concurrent: {
			server: [
				'sass:server',
                'sass:server',
                'imagemin:server',
                'copy:server'
			],
			dist: [
				'sass:build',
                'autoprefixer',
                'imagemin',
				'svgmin',
                'concat',
                'uglify'
			]
		}
	});

	grunt.loadNpmTasks('assemble');

	grunt.registerTask('server', [
		'clean',
		'assemble',
		'sass-convert',
		'browserSync',
		'watch'
	]);

	grunt.registerTask('build', [
		'clean',
		'assemble',
		'copy:build',
		'useminPrepare',
		'concurrent:dist',
		'modernizr',
		'usemin',
		'htmlmin'
	]);

	grunt.registerTask('default', [
		'build'
	]);

};
