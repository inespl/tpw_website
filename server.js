const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname + '/dist/proj-tpw-g5'));
app.get('/*', function(req,res) {
res.sendFile(path.join(__dirname+ '/dist/proj-tpw-g5/index.html'));});
app.listen(process.env.PORT || 8080);
