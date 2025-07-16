const express = require('express');
const bodyParser = require('body-parser');
const sweetRoutes = require('../routes/sweetRoutes');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Use routes
app.use('/', sweetRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
