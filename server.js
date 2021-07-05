const express = require('express');
const ejs = require('ejs');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(process.env.PORT || 8000, () => {
    console.log("Server ready on port 8000");
});