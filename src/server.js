var express = require('express'),
    app = express(),
    http = require('http').Server(app);



// app.get('/', function(req, resp) {
// });
app.use(express.static(__dirname+'/public'));

http.listen(3000, function(){
    console.log('listening on *:3000');
});

// app.use(express.static('public'));






