const pg = require('pg');

const { dbConfig: config } = require('./config');

// Singleton pattern for managing database connections
class Database {
	/**
	 * @type {pg.Client|null}
	 */
	static #connection = null;

	/**
	 * @type {pg.Pool?}
	 */
	static #pool = null;

	static async connect() {
		if (this.#connection) {
			return;
		}

		try {
			this.#pool = new pg.Pool({
				host: config.host,
				password: config.password,
				port: config.port,
				user: config.user,
				database: config.database,
			});

			this.#connection = await this.#pool.connect();

			console.log('Database connected successfully');
		} catch (error) {
			console.error(error);
		}

		return;
	}

	static getClient() {
		return this.#connection;
	}

	static getPool() {
		return this.#pool;
	}

	static async disconnect() {
		await this.#pool?.end();
		await this.#connection?.end();
		console.log('closing pg');
		this.#pool = null;
		this.#connection = null;
	}

	/**
	 *
	 * @param {string} query
	 * @param {any[]} values
	 */
	static async execute(query, values = []) {
		if (!this.#connection) throw new Error('Database not connected');

		const result = await this.#connection.query(query, values);
		return result.rows;
	}
}

module.exports = { Database };
