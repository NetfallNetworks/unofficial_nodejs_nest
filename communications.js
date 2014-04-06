(function() {
	var https = require('https'), http = require('http');

	var doRequest = function(url, options, done, data) {
		var allData = [];
		var request;

		var response = function(response) {

			response.setEncoding('utf8');
			response.on('data', function(data) {
				allData.push(data);
			});
			response.on('error', function() {
				if (done) {
					done(null, response.headers || {});
				}
			});
			response.on('end', function() {
				// convert all data
				allData = allData.join('');
				if (allData && typeof allData === 'string' && allData.length > 0) {
					try {
						allData = JSON.parse(allData);
					} catch(ex) {
						commsExports.logger.error('post', {
							exception : ex
						});
						allData = null;
					}
				} else {
					allData = null;
				}
				if (done) {
					done(allData, response.headers || {});
				}
			});
		};

		var error = function(err) {
			commsExports.logger.error(options.method, {
				exception : err
			});
			if (done) {
				done(null);
			}
		};
		
		if (options.ssl) {
			request = https.request(options, response).on('error', error);
		} else {
			request = http.request(options, response).on('error', error);
		}

		if (options.method == 'POST') {
			request.write(data);
		}

		request.end();
	};

	var commsExports = {
		'doRequest' : doRequest,
		'logger' : {
			error : function(msg, props) {
				console.log(msg);
				if (!!props)
					console.trace(props.exception);
			},
			warning : function(msg, props) {
				console.log(msg);
				if (!!props)
					console.log(props);
			},
			notice : function(msg, props) {
				console.log(msg);
				if (!!props)
					console.log(props);
			},
			info : function(msg, props) {
				console.log(msg);
				if (!!props)
					console.log(props);
			},
			debug : function(msg, props) {
				console.log(msg);
				if (!!props)
					console.log(props);
			}
		}
	};

	var root = this;
	// might be window ...
	if ( typeof exports !== 'undefined') {
		if ( typeof module !== 'undefined' && module.exports) {
			exports = module.exports = commsExports;
		}
		exports.comms = commsExports;
	} else {
		root.comms = commsExports;
	}

})();
