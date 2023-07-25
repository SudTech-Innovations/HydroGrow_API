# HydroGrow_API
 
# Prérequis
```
npm init -y
npm install express
npm install -g nodemon
npm install -g sequelize-cli
npm install --save sequelize@3.30.4
npm install mysql --save 
sequelize init
```

Si besoin :
```
npm audit fix --force
```


## Pour lancer l'API 
```
nodemon
```

## Si besoin : Créer un modèle 
Exemple :
```
sequelize model:create --name User --attributes "email:string,username:string,password:string" 
```

# Base de donnée 

## Créer une base 
```
create database bdd_api_development;
create database bdd_api_test;
create database bdd_api_production;
```

Migrer les bases :
```
sequelize db:migrate
```

# Créer un système d'authentification

## Prérequis
```
npm install jsonwebtoken --save
npm install bcrypt --save
npm install body-parser --save
npm install async --save
```

