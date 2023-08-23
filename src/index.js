const express = require('express');
const route = require('./router');

const app = express();

app.use(express.json())

app.use(route)

app.listen(3000)