const keys = require('./keys');

//Express app Set up
const express= require('express');
const bodyParser = require('body-parser');
const cors = require ('cores');
const app = express();
app.use(cors());
app.use(bodyParser.json());

//PostGres Client Set-up
const {Pool} = require('pg');
const pgClient = new Pool({
    user:keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort


});
pgClient.on('error', () => console.log('Lost PG Connection'));

pgClient
.query('CREATE TABLE IF NOT EXISTS values (number INT)')
.catch(err => console.log(err));

//Redis client Set up
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy : () => 1000
});
const redisPublisher = redisclient.duplicate();


//Express Route handlers
//Test Route which makes that application is working fine
app.get('/', (req,res) => {
    res.send('Hi');
});

//Query a running POSTgres instance and the values that have ever been submitted to postgres
app.get('/values/all', async (req,res) => {
    const values = await pgClient.query('SELECT * from values');
    res.send(values.rows);
});

//Retrieve all different indices and submitted to backend and saved in REDIS
app.get('/values/current', async(req,res) => {
    redisClient.HGETALL('values', (err,values) => {
        res.send(values);
    });
});

//Post the entered index  to backend.
app.post('/values', async(req,res) => {
    const index = req.body.index;

    if(parseInt(index)> 40) {
        return res.status(422).send('Index too high');
    }

    redisClient.hset('values', 'index', 'Nothing yet');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
    res.send({working: true});
});

app.listen(5000, err => {
    console.log('Listening');
});