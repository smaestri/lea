
launch mongo
******************

1 / Add user
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

Change MongoAuthenticationConfig accordingly

2/ THen Connect to mongo :
./mongo --port 27018 -u "admin" -p "password" --authenticationDatabase "admin"

3/ Add some data
use lea
db.categorie.save({name: 'Roman'})
db.userProfile.save({type: 'USER'})


4 / Launch demon:
dev : ./mongod --port 27018 --dbpath ~/temp --auth

debug BACKEND
**************

Simply launch debug on main class Application.java with profile "dev"
 -Dspring.profiles.active=dev in Vm options

 In Production, no prodile => default one


deploy as a service on prod
**************************
- COpy file on VPS : scp target/backend-1.0-SNAPSHOT.jar root@51.255.38.85:/opt/
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
