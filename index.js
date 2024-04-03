const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const { Database } = require('./lib/database');

const app = require('./server');

app.use('/', indexRouter());
app.use('/api', apiRouter());

const port = process.env.PORT || 3000;

process.on('beforeExit', async () => {
	console.log('BEFORE EXIT');
});

app.listen(port, async () => {
	await Database.connect();
	console.log(`Server running on port ${port}`);
});
