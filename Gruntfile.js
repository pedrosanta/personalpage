require('dotenv').config();

module.exports = grunt => {

  grunt.initConfig({

    copy: {
      dev: {
        expand: true,
        cwd: 'app/',
        src: ['**', '!**/*.mustache'],
        dest: '.tmp/'
      },
      dist: {
        expand: true,
        cwd: 'app/',
        src: ['**', '!**/*.mustache'],
        dest: 'dist/'
      }
    },

    mustache_render: {
      dev: {
        options: {
          data: {
            dist: false
          }
        },
        expand: true,
        cwd: 'app/',
        src: '**/*.mustache',
        dest: '.tmp/',
        ext: '.html'
      },
      dist: {
        options: {
          data: {
            dist: true,
            gtm_container_id: process.env.GTM_CONTAINER_ID
          }
        },
        expand: true,
        cwd: 'app/',
        src: '**/*.mustache',
        dest: 'dist/',
        ext: '.html'
      }
    },

    connect: {
      options: {
        base: '.tmp'
      },
      dev: {
        options: {
          livereload: true,
          open: true
        }
      },
      server: {}
    },

    watch: {
      app: {
        options: {
          livereload: true
        },
        files: 'app/**',
        tasks: ['build']
      }
    },

    clean: ['.tmp', 'dist'],

    rsync: {
      options: {
        args: ["--verbose"]
      },
      production: {
        options: {
            src: "dist/",
            dest: "~/pedrosanta.com",
            host: "pedrosanta@pedrosanta.com",
            delete: true,
            recursive: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mustache-render');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-rsync');

  grunt.registerTask('build:dev', 'Build all the files needed for local/dev.', [
    'copy:dev',
    'mustache_render:dev'
  ]);

  grunt.registerTask('build:dist', 'Build all the files needed for production.', [
    'copy:dist',
    'mustache_render:dist'
  ]);

  grunt.registerTask('build', 'Build all the files needed for local/dev and production.', [
    'build:dev',
    'build:dist'
  ]);

  grunt.registerTask('dev', 'Development task for building files, launch a server and watch changes.', [
    'build:dev',
    'connect:dev',
    'watch'
  ]);

  grunt.registerTask('server', 'Run the server.', ['connect:server:keepalive']);

  grunt.registerTask('deploy', 'Deploy built code to the server.', [
    'build:dist',
    'rsync:production'
  ]);

  grunt.registerTask('default', ['build']);
};
