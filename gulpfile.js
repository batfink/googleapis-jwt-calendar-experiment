var googleapis = require('googleapis');
var handlebars = require('handlebars');
var helpers = require('./src/helpers');
var gulp = require('gulp');
var file = require('gulp-file');
var moment = require('moment');
var beautify = require('gulp-beautify');
var fs = require('fs');

var authClient = new googleapis.auth.JWT(process.env.GOOGLE_SERVICE_ACCOUNT, '', process.env.GOOGLE_PEM_KEY, ['https://www.googleapis.com/auth/calendar.readonly'], '');

function getEvents(cb) {
    authClient.authorize(function(err, tokens) {

        if (err) {
            console.log(err)
            return;
        }

        googleapis
            .discover('calendar', 'v3')
            .withAuthClient(authClient)
            .execute(function(err, client) {

                // show calendar events in 2014
                client.calendar.events.list({
                    calendarId: 'ues0gtpvhct03s89nrarvq4bl0@group.calendar.google.com',
                    singleEvents: true,
                    orderBy: 'startTime',
                    fields: 'items(end,start,summary)',
                    timeMin: new Date('2014').toISOString(),
                    timeMax : new Date(new Date('2015').setMilliseconds(new Date('2015').getMilliseconds() - 1)).toISOString()
                }).execute(function(err, result) {
                    cb(result.items);
                });

            });
    });
}

function createJsonCalendar(datetime) {
    var date = moment(datetime),
        year = [],
        daysInYear = date.isLeapYear() ? 366: 365;

    for (var i = 0; i < 12; i++) {
        year.push([])
    }

    for (var i = 0; i < daysInYear; i++) {
        year[date.month()][date.date() - 1 ] = {

            monthName: moment.langData('nb').months(date),
            dayName: moment.langData('nb').weekdays(date),
            date: date.date(),
            events: []
        };
        date.add('days', 1)
    }

    return year;
}


gulp.task('getEvents', function() {

    getEvents(function(data) {
        var datetime = '2014-01-01T02:00:00.000Z';
        var year = createJsonCalendar(datetime);

        data.forEach(function(event) {

            var start = event.start;
            var format = !!start.date ? 'date' : 'dateTime';
            var date = event.start[format].split('-');
            date[2] = date[2].split('T')[0];

            year[date[1] - 1][date[2] - 1].events.push(event);

        });

        file('calendar.json', JSON.stringify(year)).pipe(beautify({ 'indent': '4' })).pipe(gulp.dest('src'));

    })
})


gulp.task('createHtml', function() {

    var template = handlebars.compile(fs.readFileSync('src/template.hbs').toString());
    var json = JSON.parse(fs.readFileSync('src/calendar.json'));

    file('calendar.html', template(json)).pipe(gulp.dest('dest'));

});
