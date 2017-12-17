init mongo
**************

use test
db.categorie.save({name: 'Roman'})
db.userProfile.save({type: 'USER'})


launch mongo
******************

be sure to add a user in admin DB in ROOT :
use admin
db.createUser(
  {
    user: "admin",
    pwd: "password",
    roles: [ { role: "root", db: "admin" } ]
  }
);
exit;

and change in MongoAuthenticateConfig.java accordingly

Launch demon:
dev : ./mongod --port 27018 --dbpath ~/temp --auth

debug BACKEND
**************

Simply launch debug on main class Application.java


deploy as a service on prod
**************************
- COpy file on VPS : scp backend-1.0-SNAPSHOT.jar root@<password>:/opt/
- Set permission : chmod a+x backend-1.0-SNAPSHOT.jar
- Create shortcut : sudo ln -s /opt/backend-1.0-SNAPSHOT.jar /etc/init.d/lea
- launch app : /etc/init.d/lea start
- log on var/log

Notes :
APACHE2 frontend set to redirect to 8090
see /etc/apache2/sites-enabled/000-default.conf

launch locally in dev mode
*****************************
on root :
mvn -Dmaven.repo.local=/opt/maven/apache-maven-3.3.9/repo/ --settings /opt/maven/apache-maven-3.3.9/conf/settings.xml clean install

and run spring boot on backend project


TODO
Add CSRF protection
