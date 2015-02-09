module.exports = function(grunt) {
require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

grunt.initConfig({
    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'styles.css': 'styles.scss'
            }
        }
    },
	watch: {
		css: {
			files: '**/*.scss',
			tasks: ['sass']
		}
	}
});

grunt.registerTask('default', ['sass']);
};
