module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    react: { // just for jsxhint, production transform is done
             // by browserify
      dynamic_mappings: {
        files: [
          {
            expand: true,
            cwd: 'src/jsx',
            src: ['*.jsx'],
            dest: 'tmp/jsx',
            ext: '.js'
          }
        ]
      }
    },
    jshint: {
      changed : [],
      js: ['Gruntfile.js', 'src/js/*.js'],
      jsx : ['tmp/jsx/*.js'],
      options: {
        "browser": true,
        "globals": {
          "React" : true,
          "CodeMirror" : true,
          "confirm" : true
        },
        "node" : true,
        "asi" : true,
        "globalstrict": false,
        "quotmark": false,
        "smarttabs": true,
        "trailing": false,
        "undef": true,
        "unused": false
      }
    },
    copy: {
      assets: {
        files: [
          // includes files within path
          {expand: true, cwd: 'src/', src: ['*'], dest: 'assets/', filter: 'isFile'},

          // includes files within path and its sub-directories
          {expand: true, cwd: 'src/vendor', src: ['**'], dest: 'assets/vendor'}

          // makes all src relative to cwd
          // {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

          // flattens results to a single level
          // {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'}
        ]
      }
    },
    browserify:     {
      options:      {
        debug : true,
        transform:  [ require('grunt-react').browserify ]
      },
      app:          {
        src: 'src/js/main.js',
        dest: 'assets/bundle.js'
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      assets: {
        files: {
          'assets/bundle.min.js': ['assets/bundle.js'],
          'assets/vendor.min.js': ['src/vendor/*.js']
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/js/*.js'],
        tasks: ['jshint:changed', 'default'],
        options: {
          spawn: false,
        },
      },
      jsx: {
        files: ['src/jsx/*.jsx'],
        tasks: ['jsxhint', 'default'],
        options: {
          spawn: false,
        },
      },
    }
  })
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  grunt.registerTask('jsxhint', ['newer:react', 'jshint:jsx']);
  grunt.registerTask('default', ['jshint:js', 'react', 'jshint:jsx', 'copy:assets', 'browserify', 'uglify']);

  grunt.event.on('watch', function(action, filepath) {
    grunt.config('jshint.changed', [filepath]);
  });
};
