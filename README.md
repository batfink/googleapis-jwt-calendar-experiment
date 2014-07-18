googleapis-jwt-calendar-experiment
==================================

An experiment with jwt authentication and Google Calendar event extraction.

Install dependencies with
```bash
npm i
```

There are currently two gulp-tasks, one for creating the calendar json-file, and one for generating the html.

There’s also a simple server which compiles the html on the fly.

To run the server on port 8000

```bash
nodemon
```

To run the gulp tasks, you’ll have to first create a service account, generate a key and then generate and secure a pem file.
Follow steps 3, 4, 5 in [Accessing Google Spreadsheets from Node.js][] by Nicholas C. Zakas and also the instructions at the bottom of the page on how to secure the PEM file.
Then share one of your calendars with your service account, and replace the calendarId in the getEvents function.

```js
calendarId: 'ues0gtpvhct03s89nrarvq4bl0@group.calendar.google.com',
```

Events are currently extracted for the year 2014 - determined by timeMin and timeMax. Change the values if you want a different range.

```js
timeMin: new Date('2014').toISOString(),
timeMax : new Date(new Date('2015').setMilliseconds(new Date('2015').getMilliseconds() - 1)).toISOString()
```

To extract events and save as json:

```bash
gulp getEvents
```

To generate a static html-file with the events in a table:

```bash
gulp createHtml
```

## Resources

* [Accessing Google Spreadsheets from Node.js][]
* [Google Calendar API](https://developers.google.com/google-apps/calendar/)
* [Google api nodejs client](https://github.com/google/google-api-nodejs-client/)
* [Google api jwt example](https://github.com/google/google-api-nodejs-client/blob/master/examples/jwt.js)
* [Google APIs Client Library for JavaScript ](https://developers.google.com/api-client-library/javascript/)
* [Moment.js](http://momentjs.com/docs/)
* [Nodemon](https://github.com/remy/nodemon#nodemon)


**Disclaimer! The generated calendar.json and calendar.html files in this repository is from a calendar I keep for keeping my eyes on interesting races. Some of the dates are from recurring yearly events and might be on the wrong day of the week.**

[Accessing Google Spreadsheets from Node.js]: http://www.nczonline.net/blog/2014/03/04/accessing-google-spreadsheets-from-node-js/
