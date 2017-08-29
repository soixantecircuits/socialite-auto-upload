const fs = require('fs');
const async = require("async");
const request = require('request');

var path = process.argv[2];

var q = async.queue(function(media, callback) {
    var regexp = /.*\//;
    var name = media.replace(regexp,"");
    var formData = {
        // Pass a simple key-value pair 
        filename: name,
        // Pass data via Streams 
        media: fs.createReadStream(media),
    };

    request.post({url:'http://localhost:6060/api/v1/actions/socialite', formData: formData}, function optionalCallback(err, httpResponse, body) {
    if (err) {
        return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
    success++;
    });

    callback();
}, 10);

q.drain = function() {
    console.log('All the media have been uploaded');
};

fs.readdir( path, function( err, files ) {
    if( err ) {
        console.error( "Could not list the directory.", err );
        process.exit( 1 );
    }
    
    files.forEach(function(element)
    {
        q.push(path+element);
    });
});