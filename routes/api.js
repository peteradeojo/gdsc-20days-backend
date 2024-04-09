const { Router } = require('express');
const joi = require('joi');
const { Database } = require('../lib/database');
const passport = require('passport');

const router = Router();

module.exports = () => {
	router.get('/hello', (req, res) => {
		return res.json({ message: 'Hello GDSC' });
	});

	router
		.route('/books')
		.get(passport.authenticate('jwt', { session: false }), async (req, res) => {
			const books = await Database.execute('SELECT * FROM books');
			return res.json(books);
		})
		.post(
			(req, res, next) => {
				const schema = joi.object({
					name: joi.string().required(),
					isbn: joi.string().optional(),
					date: joi.date(),
				});

				const { error } = schema.validate(req.body);
				if (error) {
					return res.status(400).json({
						error: error.details,
					});
				}

				next();
			},
			async (req, res) => {
				try {
					const book = await Database.execute(
						'INSERT INTO books (name, isbn, datePublished) VALUES ($1, $2, $3) RETURNING name, isbn, datePublished;',
						[req.body.name, req.body.isbn, req.body.date],
					);

					return res.status(201).json(book[0]);
				} catch (error) {
					console.error(error);
					return res.status(500).json({ error: error.message });
				}
			},
		);

	router
		.route('/books/:id')
		.get(async (req, res) => {
			const book = await Database.execute(`SELECT * FROM books WHERE id=$1`, [
				req.params.id,
			]);

			if (book.length < 1) {
				return res.status(404).json({
					error: 'Resource not found',
				});
			}

			return res.json(book[0]);
		})
		.patch(
			(req, res, next) => {
				const schema = joi.object({
					name: joi.string().required(),
					isbn: joi.string().optional(),
					date: joi.date(),
				});
				const { error } = schema.validate(req.body);
				if (error) {
					return res.status(400).json({
						error,
					});
				}
				next();
			},
			async (req, res) => {
				try {
					const book = await Database.execute(
						`SELECT * FROM books WHERE id = $1`,
						[req.params.id],
					);

					if (book.length < 1) {
						return res.status(404).json({ error: 'Resource  not found.' });
					}

					const { name, isbn, date } = req.body;
					const update = await Database.execute(
						`UPDATE books SET name = $1, isbn = $2, datePublished = $3 WHERE id = $4 RETURNING name, isbn, datePublished;`,
						[
							name || book[0].name,
							isbn || book[0].isbn,
							date || book[0].datePublished,
							req.params.id,
						],
					);

					return res.json(update[0]);
				} catch (error) {
					return res.status(500).json({ error: error.message });
				}
			},
		)
		.delete(async (req, res) => {
			try {
				const result = await Database.execute(
					'DELETE FROM books WHERE id=$1 RETURNING name, isbn, datePublished',
					[req.params.id],
				);

				return res.json(result[0]);
			} catch (error) {
				return res.status(500).json({ error });
			}
		});
	return router;
};
