const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path');

app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/assets')))
app.use('/fonts', express.static(path.join(__dirname, '/node_modules/@fortawesome/fontawesome-free/webfonts')))
app.use('/leaflet', express.static(path.join(__dirname, '/node_modules/leaflet/dist')))

app.use(express.static('css'))
app.use(express.static('js'))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('*', function(req, res) {
    res.redirect('/');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
