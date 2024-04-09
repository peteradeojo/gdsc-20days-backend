const { Database } = require('../lib/database');
const bcrypt = require('bcrypt');

class User {
	async findUser(username) {
		const [user] = await Database.execute(
			'SELECT * FROM users WHERE username = $1',
			[username],
		);

		return user;
	}

	newUser({ username, password }) {
		const hash = bcrypt.hashSync(password, 12);
		return Database.execute(
			'SELECT count(id) num from users where username = $1',
			[username],
		)
			.then(([num]) => {
				if (num.num > 0) {
					throw new Error('Username is taken');
				}

				return Database.execute(
					'INSERT into users (username, password) values ($1, $2) RETURNING id,username',
					[username, hash],
				)
					.then(([data]) => data)
					.catch((err) => {
						console.error(err);
						throw err;
					});
			})
			.catch((err) => {
				throw err;
			});
		// if (count > 0) throw new Error('Username is taken');

		// return Database.execute(
		// 	'Insert into users (username, password) values ($1, $2);',
		// 	[username, hash],
		// );
	}
}

module.exports = User;
