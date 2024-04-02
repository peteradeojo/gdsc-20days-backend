const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = require('./server');

app.use('/', indexRouter());
app.use('/api', apiRouter());

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
