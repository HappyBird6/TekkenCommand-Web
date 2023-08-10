const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');

const server = app.listen(3000,() =>{
    console.log('Start Server : localhost:3000');
})

app.use(express.static(path.join(__dirname, 'public')));