Installation :

prerequisites : Launch a mongoDB instance

1 - Launch FRONT : npm run build

2 - launch BACK : mvn spring-boot:run


Some queries

1 - Set all books to free :
db.test.updateMany(
    // query
    {
        "livres.statut" : { $ne: "FREE"}
    },
    // update
    {
        $set: {
           "livres.$.statut" : "FREE"
        }
    },

    // options
    {
        "multi" : true,  // update only one document
        "upsert" : false  // insert a new document, if no existing document match the query
    }
);

