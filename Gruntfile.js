module.exports = function (grunt) {

	// 1. All configuration goes here
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			dist: {
				src: [
					'./js/app.js'
				],
				dest: './build/js/scripts.js'
			}
		},

		uglify: {
			build: {
				src: './build/js/scripts.js',
				dest: './build/js/scripts.min.js'
			}
		},

		haml: {
			'ruby_html': {
				options: {
					language: 'ruby'
				},
				files: {
					'./build/index.html': './haml/index.haml'
				}
			}
		},

		sass: {
			dist: {
				files: [
					{
						'./build/css/index.css': 'scss/index.scss'
					}
				]
			},
			options: {
				compass: true,
				style: 'compressed'
			}
		},

		copy: {
			main: {
				files: [
					// includes files within path
					{src: ['./fonts/**'], dest: './build/'}
				]
			}
		},

		connect: {
			server: {
				options: {
					port: 8000,
					hostname: "127.0.0.1",
					base: './build',
					keepalive: true
				}
			}
		},

		htmlmin: {
			options: {
				removeComments: true,
				collapseWhitespace: true
			},
			compile: {
				files: {
					'build/index.html': ['build/index.html']
				}
			}
		},

		watch: {
			haml: {
				files: ['haml/*.haml'],
				tasks: ['haml'],
				options: {
					spawn: false
				}
			},
			sass: {
				files: '**/*.scss',
				tasks: ['sass'],
				options: {
					spawn: false
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-haml');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['concat', 'uglify', 'haml', 'sass', 'htmlmin', 'copy']);

};