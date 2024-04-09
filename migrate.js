const fs = require('fs');
const path = require('path');

const { Database } = require('./lib/database');

let upMode = true;
let downMode = false;
const argv = process.argv.slice(2);

if (argv.includes('--down')) {
	downMode = true;
	upMode = false;
}

if (argv.includes('--up')) upMode = true;

if (upMode && downMode) {
	console.error('Only one of up or down is expected');
	process.exit();
}

const parseMigration = (filename) => {
	try {
		const queries = fs
			.readFileSync(path.resolve(__dirname, `database/migrations/${filename}`))
			.toString();

		let [up, ...down] = queries
			.replace(new RegExp('\r\n', 'g'), '')
			.split('------', 2);

		down = down.join('');
		return {
			up,
			down,
		};
	} catch (error) {
		return { up: '', down: '' };
	}
};

const runUp = async () => {
	const migrationFiles = fs
		.readdirSync(path.resolve(__dirname, 'database/migrations'))
		.filter((name) => name.endsWith('.sql'));
	let run = await Database.execute('SELECT name FROM migrations');

	run = run.map((r) => r.name);

	const queries = migrationFiles.map((filename) => ({
		file: filename,
		...parseMigration(filename),
	}));

	for (let q of queries) {
		if (run.includes(q.file)) continue;

		try {
			await Database.execute(q.up);
			await Database.execute(
				`INSERT INTO migrations (name, up, down) VALUES ($1, $2, $3);`,
				[q.file, q.up, q.down],
			);
		} catch (err) {
			console.error(err);
			console.log('ERROR occurred:', q.up);
		} finally {
			console.log('Done');
			process.exit();
		}
	}
};
const runDown = async () => {
	const [migration] = await Database.execute(
		`SELECT * FROM migrations ORDER BY id DESC LIMIT 1`,
	);

	if (migration) {
		try {
			await Database.execute(migration.down);
			await Database.execute(`DELETE FROM migrations WHERE id=$1`, [
				migration.id,
			]);
		} catch (err) {
			console.error(err);
			console.log('ERROR:', migration.down);
		}
	}
};

(async () => {
	await Database.connect();

	const r = await Database.execute(
		'SELECT tablename FROM pg_tables WHERE tablename=$1',
		['migrations'],
	);

	if (r.length < 1) {
		await Database.execute(`create table migrations (
      id serial primary key,
      name text,
      up text,
      down text,
      createdat timestamp default(now())
    );`);
	}

	if (upMode) {
		await runUp();
	} else {
		await runDown();
	}

	await Database.disconnect();
	process.exit();
})();
