var Handlebars = require('handlebars');
var moment = require('moment');

Handlebars.registerHelper('fiddle', function(context) {

    var months = context.data.root;
    var today = moment();

    // find today
    months[today.month()][today.date()-1].today = true;

    months.forEach(function(month) {
        for (i = month.length; i < 31; i++) {
            month.push({});
        }
    })

});
