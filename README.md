# ZxVentures

#### Required:
* Node.js v11+
* MongoDB v3.4+
* git

#### Deploy:
You can change env vars (db name and db url) at packages.json.
I'm assuming the db is zxventures and mongodb is at localhost on port 27017.

```sh
git clone git@github.com:rodrigoalviani/zxventures.git
cd zxventures
npm i
npm run deploy
npm run start
```
And server is up on http://localhost:3000

#### Tests and coverage:
```sh
npm run test
```

#### Docs
* Swagger (on doc folder)
* Postman collection (on doc folder)
