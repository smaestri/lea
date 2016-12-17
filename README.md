
Update all books to status free : not working

db.utilisateur.updateMany({}, {$set: {"livres": {statut: "FREE"}}})
