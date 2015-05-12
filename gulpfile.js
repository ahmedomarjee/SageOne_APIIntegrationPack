var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();

gulp.task('less', function() {
    return gulp.src(['./public/~less/*.less', '!**/*.*.less'])
        .pipe($.less())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('build', ['less'], function() {

    gulp.src(['./**/*.js', '!public/lib/**', '!node_modules/**', '!build/**', '!gulpfile.js'])
        .pipe($.uglify())
        .pipe(gulp.dest('build'))

    gulp.src(['./**/*.html', '!public/lib/**', '!node_modules/**', '!build/**'])
        .pipe($.minifyHtml({
            empty: true
        }))
        .pipe(gulp.dest('build'))

    gulp.src(['./**/*.css', '!public/lib/**', '!node_modules/**', '!build/**'])
        .pipe($.minifyCss())
        .pipe(gulp.dest('build'))

    gulp.src(['public/lib/**'])
        .pipe(gulp.dest('build/public/lib'))

    gulp.src(['public/img/**'])
        .pipe(gulp.dest('build/public/img'))

    gulp.src(['public/*.ico'])
        .pipe(gulp.dest('build/public'))

    gulp.src(['package.json'])
        .pipe(gulp.dest('build'))

});

gulp.task('watch', function() {
    gulp.watch('./public/~less/*.less', ['less'])
});


gulp.task('host', function() {
    $.nodemon({
            script: './server/start.js',
            ext: 'js',
            ignore: ['./public']
        })
        .on('restart', function() {
            console.log('started.')
        });
});


gulp.task('default', ['less', 'watch', 'host'], function() {
    setTimeout(function() {
        require("opn")('http://localhost:9000')
    }, 1000)
});
