var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');


function removeLowestScoreHW(arr) {
        var minScore = Number.MAX_VALUE;
        var minId = -1;
        var arrResult = [];

        // Recorro el array que me pasan por parámetro
        // Por cada posición, compruebo si es de tipo HW
        // y si su score es el minimo, si es así lo guardo
        for(var i=0; i< arr.length; i++) {
            var score = arr[i]['score'];
            var type  = arr[i]['type'];
            if(type === 'homework' && score < minScore) {
                minScore = score;
                minId = i;
            }
        }

        // Recorro de nuevo el array y voy rellenando un
        // nuevo array con todas los valores anteriores, salvo
        // cuando el id coincida con el del valor minimo salvado
        // anteriormente
        for(var i=0; i< arr.length; i++) {
            if(i !== minId){
                arrResult.push(arr[i]);
            }
        }

        return arrResult;
};

MongoClient.connect('mongodb://localhost:27017/school', function(err, db){
    if(err) throw err;

    // Pasamos toda la colección a un array para poder manejarlo
    db.collection('students').find({}).toArray(function(err, docs) {
        if(err) throw err;

        //Actualizamos cada documento, eliminando el HW de menor Score
        // llamando a la función creada.
        // Esto devuelve un nuevo array con los HW mas bajos eliminados
        _.each(docs, function(doc) {
            doc.scores = removeLowestScoreHW(doc.scores);
            // Actualizo la colección, insertando
            db.collection('students').update({'_id': doc._id}, doc, {}, function(err, result) {
                if(err) throw err;
            });
        });
        db.close();
    });

});
