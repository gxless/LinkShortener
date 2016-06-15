//import core modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var dbConnection = process.env.OPENSHIFT_MONGODB_DB_PASSWORD ?
	process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
	process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
	process.env.OPENSHIFT_MONGODB_DB_HOST + ":" +
	process.env.OPENSHIFT_MONGODB_DB_PORT + "/" +
	process.env.OPENSHIFT_APP_NAME : "mongodb://localhost/linkshortener";
mongoose.connect(dbConnection);

var domain = process.env.OPENSHIFT_APP_NAME ?
	'http://linkshortener-xianggao.rhcloud.com/' : 'http://localhost:3000/';
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/views'));



//database schemas
var LinkPairSchema = mongoose.Schema({
	originalLink: String,
	shortenedLink: String
}, {collection: 'linkpair'});

var CounterSchema = mongoose.Schema({
	_id: String,
	counter: Number
}, {collection: 'counter'});

var LinkPairModel = mongoose.model('LinkPairModel', LinkPairSchema);
var CounterModel = mongoose.model('CounterModel', CounterSchema);



//restful apis
app.post('/originalLink', getShortenedLink);
app.get('/:shortenedLink', rediToOriginLink);


function getShortenedLink(req, res) {
	
	var originalLink = req.body.originalLink;

	LinkPairModel.findOne({originalLink: originalLink}, function(err, doc) {

		if(err) throw err;

		//original link has been stored in db, return shortened link
		if(doc) {
			var newLink = domain + doc.shortenedLink;
			res.json(newLink);

		}
		//original link does not exist in db, generate shortened link
		else {
			var newlinkPair = {
				originalLink: req.body.originalLink,
				shortenedLink: '00000'
			};

			CounterModel.findOneAndUpdate({_id: 'counterId'},
				{$inc: {counter: 1}}, {new: true}, function (err, doc) {

				if(err) throw err;

				//get next counter sequence
				//counter exists, generate shortened link path
				if(doc) {
					newlinkPair.shortenedLink = createShortenedLink(doc.counter);

				}
				//counter does not exist, initialize counter
				else {
					var InitCounter = {
						_id: 'counterId',
						counter: 0
					};
					CounterModel.create(InitCounter, function (err) {
						if(err) throw err;
					});

				}

				//save new link pair into db.linkpair
				LinkPairModel.create(newlinkPair, function (err, doc) {

					if(err) throw err;

					if(doc) {
						var newLink = domain + doc.shortenedLink;
						res.json(newLink);
					}
				});

			});
		}
	});	
}


function rediToOriginLink(req, res) {

	LinkPairModel.findOne({shortenedLink: req.params.shortenedLink},
		function(err, doc) {

			if(err) throw err;

            //shortened link: in db, redirect; not in db, 404
			if(doc) {
				return res.redirect(301, doc.originalLink);
			}
            else {
				res.status(404).send('404: Page not Found');
			}
		});
}


function createShortenedLink(counter) {

	var alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var path = "00000";
	var index = 4;

	while(counter != 0) {
		path = path.substr(0, index) + alphabet.charAt(counter % 62)
			+ path.substr(index + 1);
		counter = Math.floor(counter / 62);
		index--;
	}

	return path;
}


app.listen(port, ip, function() {
	console.log('server is running..');
});
