/**
 * grunt-pagespeed-ngrok
 * http://www.jamescryer.com/grunt-pagespeed-ngrok
 *
 * Copyright (c) 2014 James Cryer
 * http://www.jamescryer.com
 */
'use strict'

var ngrok = require('ngrok');
var mozjpeg = require('imagemin-mozjpeg');

module.exports = function(grunt) {

  // Load grunt tasks
  require('load-grunt-tasks')(grunt);

  // Grunt configuration
  grunt.initConfig({
    pagespeed: {
      options: {
        nokey: true,
        locale: "en_GB",
        threshold: 40
      },
      local: {
        options: {
          strategy: "desktop"
        }
      },
      mobile: {
        options: {
          strategy: "mobile"
        }
      }
    },
    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [{
            name: 'sm',
            width: '25%'
          },{
            name: 'md',
            width: '70%'
          },{
            name: 'lg',
            width: '100%'
          }]
        },

        /*
        You don't need to change this part if you don't change
        the directory structure.
        */
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'src/img',
          dest: 'dist/images/'
        },
        {
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'src/views/images',
          dest: 'dist/views/img/'
        }]
      }
    },

    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 7,
          use: [mozjpeg({quality:30})]
          },
        files: [{
          expand: true,
          cwd: 'dist/images/',
          src: ['**/*.{png,jpg}','!profilepic*.jpg'],
          dest: 'dist/images/'
        },
          {
            expand: true,
            cwd: 'dist/views/img/',
            src: ['**/*.{png,jpg}'],
            dest: 'dist/views/img/'
            }]
         }
      },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['dist/images','dist/views/img'],
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['dist/images','dist/views/img']
        },
      },
    },

    /* Copy the "fixed" images that don't go through processing into the images/directory */
    copy: {
      dev: {
        files: [{
          expand: true,
          src: 'src/img/fixed/*.{gif,jpg,png}',
          dest: 'dist/images/'
        },
        {
          expand: true,
          src: 'src/views/images/fixed/*.{gif,jpg,png}',
          dest: 'dist/views/img/'
        }
      ]
      },
    },
    uglify: {
       my_target: {
         files: {
           'dist/js/perfmatters.min.js': ['src/js/perfmatters.js'],
           'dist/views/js/main.min.js': ['src/views/js/main.js']
         }
       }
     },
   cssmin: {
     target: {
       files: [{
         expand: true,
         cwd: 'src/css',
         src: ['*.css', '!*.min.css'],
         dest: 'dist/css',
         ext: '.min.css'
       },
       {
         expand: true,
         cwd: 'src/views/css',
         src: ['*.css', '!*.min.css'],
         dest: 'dist/views/css',
         ext: '.min.css'
       }]
     }
 }
  });

  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');


  // Register customer task for ngrok
  grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
    var done = this.async();
    var port = 8080;

    ngrok.connect(port, function(err, url) {
      if (err !== null) {
        grunt.fail.fatal(err);
        return done();
      }
      grunt.config.set('pagespeed.options.url', url);
      grunt.task.run('pagespeed');
      done();
    });
  });

  // Register default tasks
  grunt.registerTask('default', 'Optimize images and test with pagespeed',function(){
    grunt.task.run(['clean', 'mkdir', 'copy', 'responsive_images', 'imagemin']);
    grunt.task.run(['uglify']);
    grunt.task.run(['cssmin']);
    //minify resources
    grunt.task.run('psi-ngrok');
  });
}
