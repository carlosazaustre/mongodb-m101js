var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/weather', function(err, db) {
    if(err) throw err;

    var query = {};
    var fields = {"State": 1, "Temperature": 1};

    // Busca en toda la colección, devolviendo los campos "State" y "Temperatura"
    var cursor = db.collection("data").find(query, fields);

    // Ordeno los datos por estado y luego por temperatura en orden decreciente
    // De esta manera el primero de cada estado será el de mayor temperatura
    cursor.sort([['State', 1], ['Temperature', -1]]);

    var state = '';

    cursor.each(function(err, doc) {
        console.log(doc);
        if(err) throw err;
        if(doc == null) {};
        else if(doc.State !== state) {
            // Cada vez que cambio de estado, es el registro de mayor
            // temperatura, hago el set y añado el campo
            state = doc.State;
            db.collection("data").update({'_id': doc._id}, {'$set': {'month_high': true}}, function(err, updated) {
                if(err) throw err;
            });
        }
    });

});
