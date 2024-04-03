const dbConfig = {
	connection: process.env.DB_CONNECTION,
	database: process.env.DB_DATABASE,
	host: process.env.DB_HOST,
	password: process.env.DB_PASSWORD || undefined,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
};

module.exports = { dbConfig };
