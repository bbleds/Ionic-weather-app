var express = require('express');
var request = require('request');

app = express();

// proxy weather api with request params sent in from front end

	app.get("/api/:lat/:lng", (req, res) => {

		// var url = "https://api.forecast.io/forcast/deddf761abe49ca199f649859b49fc32/"+req.params.lat+","+req.params.lng;
		var url = "https://api.forecast.io/forecast/deddf761abe49ca199f649859b49fc32/"+req.params.lat+","+req.params.lng;
		//use request package to query api
		request.get(url, (err, response, body)=>{
			//if error with request, throw an error
			if(err) throw err;
			//send response from api to front end
			res.send(body);
		})
	});

app.use(express.static('www'));
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});