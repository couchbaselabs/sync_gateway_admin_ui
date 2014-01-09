module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    react: {
      dynamic_mappings: {
        files: [
          {
            expand: true,
            cwd: 'src/jsx',
            src: ['*.jsx'],
            dest: 'assets/jsx',
            ext: '.js'
          }
        ]
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'assets/**/*.js'],
      options: {
        "browser": true,
        "globals": {
          "React" : true
        },
        "node" : true,
        "asi" : true,
        "globalstrict": false,
        "quotmark": false,
        "smarttabs": true,
        "trailing": false,
        "undef": true,
        "unused": true
      }
    },
    browserify:     {
      options:      {
        transform:  [ require('grunt-react').browserify ]
      },
      app:          {
        src:        'src/main.js',
        dest:       'assets/bundle.js'
      }
    }
  })
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['react', 'jshint']);

};
