const express = require('express');
const routes = require('./routes');
const cookieParser = require('cookie-parser');

require('./database');


const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(routes);


app.listen(80);