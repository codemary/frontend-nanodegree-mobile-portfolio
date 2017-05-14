/**
 * grunt-pagespeed-ngrok
 * http://www.jamescryer.com/grunt-pagespeed-ngrok
 *
 * Copyright (c) 2014 James Cryer
 * http://www.jamescryer.com
 */
'use strict'

var ngrok = require('ngrok');

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
            width: '25%',
            quality: 30
          },{
            name: 'lg',
            width: '50%',
            quality: 40
          }]
        },

        /*
        You don't need to change this part if you don't change
        the directory structure.
        */
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'img',
          dest: 'images/'
        },
        {
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'views/images',
          dest: 'views/img/'
        }]
      }
    },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['images','views/img'],
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['images','views/img']
        },
      },
    },

    /* Copy the "fixed" images that don't go through processing into the images/directory */
    copy: {
      dev: {
        files: [{
          expand: true,
          src: 'img/fixed/*.{gif,jpg,png}',
          dest: 'images/'
        },
        {
          expand: true,
          src: 'views/images/fixed/*.{gif,jpg,png}',
          dest: 'views/img/'
        }
      ]
      },
    },
    uglify: {
       my_target: {
         files: {
           'js/perfmatters.min.js': ['js/perfmatters.js'],
           'views/js/main.min.js': ['views/js/main.js']
         }
       }
     },
   cssmin: {
     target: {
       files: [{
         expand: true,
         cwd: 'css',
         src: ['*.css', '!*.min.css'],
         dest: 'css',
         ext: '.min.css'
       },
       {
         expand: true,
         cwd: 'views/css',
         src: ['*.css', '!*.min.css'],
         dest: 'views/css',
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
    grunt.task.run(['clean', 'mkdir', 'copy', 'responsive_images']);
    grunt.task.run(['uglify']);
    grunt.task.run(['cssmin']);
    //minify resources
    grunt.task.run('psi-ngrok');
  });
}
