# P7 Open Classrooms Webdev

Le projet consiste à construire un MVP d'un réseau social interne pour les employés de Groupomania.
Node Js requis

### Backend

- Installer MySqlServer et lancer le serveur
- Lancer MySql sur votre terminal et taper la commande CREATE DATABASE groupomania;

- Ouvrez le fichier backend/config/config.json et configurez la base de données dévellopement avec vos identifiants

- Dans votre terminal allez dans le dossier backend et tapez la commade > npm install
- Puis tapez la commande node_modules/.bin/sequelize db:migrate

- Enfin lancez le server avec node server ou nodemon server


### Frontend

- Dans votre terminal allez dans le dossier frontend et tapez la commade > npm install
- Puis lancez nimporte quel fichier html du dossier

### Compte Admin

- Pour creer un compte administarateur ouvrez le fichier backend/controllers/users.js et a la ligne 55 passez idAdmin a 1. Puis créez votre compte sur l'application web. N'oubliez pas de le remettre a 0 une fois le compte créé. 
