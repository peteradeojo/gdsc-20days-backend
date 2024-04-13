const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const express = require('express');
const path = require('path');

const { Database } = require('./lib/database');

const app = require('./server');
const authRouter = require('./routes/auth');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter());
app.use('/api', apiRouter());
app.use('/auth', authRouter());

const port = process.env.PORT || 3000;

process.on('beforeExit', async () => {
	console.log('BEFORE EXIT');
});

app.listen(port, async () => {
	await Database.connect();
	console.log(`Server running on port ${port}`);
});
