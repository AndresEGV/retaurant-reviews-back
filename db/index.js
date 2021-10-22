const {Pool} = require('pg');

const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'yelp',
    password: 'postgres',
    port: 5432

}
const pool = new Pool(config)