init mongo
**************

use test
db.categorie.save({name: 'Roman'})
db.userProfile.save({type: 'USER'})



deploy asa service on prod
**************************
chmod a+x backend-1.0-SNAPSHOT.jar
sudo ln -s /opt/backend-1.0-SNAPSHOT.jar /etc/init.d/lea
/etc/init.d/lea start
log on var/log