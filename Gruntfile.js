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
    watch: {
      scripts: {
        files: ['src/js/*.js'],
        tasks: ['default'],
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

  grunt.registerTask('jsxhint', ['newer:react', 'jshint:jsx']);
  grunt.registerTask('default', ['jshint:js', 'react', 'jshint:jsx', 'browserify']);

};
