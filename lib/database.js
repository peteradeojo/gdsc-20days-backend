const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const pg = require('pg');
const path = require('path');

const { dbConfig: config } = require('./config');

// Singleton pattern for managing database connections
class Database {
	/**
	 * @type {sqlite.Database|pg.Client|null}
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
			if (config.connection == 'sqlite') {
				this.#connection = await sqlite.open({
					filename: path.resolve(__dirname, '..', config.database),
					driver: sqlite3.Database,
				});
			} else {
				this.#pool = new pg.Pool({
					host: config.host,
					password: config.password,
					port: config.port,
					user: config.user,
				});

				this.#connection = await this.#pool.connect();
			}

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
		// this.#connection
	}

	/**
	 *
	 * @param {string} query
	 * @param {any[]} values
	 */
	static async execute(query, values = []) {
		if (!this.#connection) throw new Error('Database not connected');

		if (this.#connection instanceof sqlite.Database) {
			return await this.#connection.exec({
				sql: query,
				values,
			});
		}

		const result = await this.#connection.query(query, values);
		return result.rows;
	}
}

module.exports = { Database };
