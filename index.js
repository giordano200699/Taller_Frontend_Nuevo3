const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/build')));

app.set('port', process.env.PORT || 5000)

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname,'/build/index.html'));
});

// const port = process.env.PORT || 5000;
// app.listen(port);
app.listen(app.get('port'), () => {
  console.log(`Server on Port ${app.get('port')} : Online`)
})

//console.log(`Password generator listening on ${port}`);

