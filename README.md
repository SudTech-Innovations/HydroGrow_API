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