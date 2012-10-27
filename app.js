var http = require('http');
var url = require('url');
var request = require('request');
var $ = require('cheerio');

http.createServer(function (req, res) {
	var queryData = url.parse(req.url, true).query;
	if(!queryData.q){
		res.writeHead(404);
		res.end();
	}else{
		var keyword = queryData.q;
		request('http://www.flipkart.com/m/search-books?query='+keyword, function (error, response, body) {
			res.writeHead(200, {'Content-Type': 'application/json'});			
			if (error) {
				var responseObj = {"error":error};
				var body = JSON.stringify(responseObj);
				res.end(body);
			} else {
				var parsedHTML = $.load(body);
				var titles = [];
				parsedHTML('.searchresult-details h2 a').each(function(i,element){
					titles.push($(element).text());
				});
				var responseObj = {"titles":titles};
				var body = JSON.stringify(responseObj);
				res.end(body);
			}
		});
	}
}).listen(3001, '127.0.0.1');
console.log('Flipkart Server running at http://127.0.0.1:3001/');
