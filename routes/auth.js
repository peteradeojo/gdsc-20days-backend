const { Router } = require('express');
const UserService = require('../services/user');
const { sign, verify } = require('jsonwebtoken');
const { compareSync } = require('bcrypt');

const router = Router();
module.exports = () => {
	const userService = new UserService();
	router.post('/login', async (req, res) => {
		try {
			const user = await userService.findUser(req.body.username);
			if (!user) {
				return res.status(400).json({ error: 'Invalid username or password' });
			}

			if (!compareSync(req.body.password, user.password)) {
				return res.status(400).json({ error: 'Invalid username or password' });
			}

			const token = sign(
				{ ...user, password: undefined },
				process.env.JWT_SECRET,
				{
					expiresIn: '6h',
				},
			);

			const refreshToken = sign(
				{ ...user, password: undefined, refreshing: true },
				process.env.JWT_SECRET,
				{
					expiresIn: '2d',
				},
			);

			return res.json({
				token,
				refreshToken,
			});
		} catch (err) {
			return res.status(500).json(err);
		}
	});

	router.post('/signup', (req, res) => {
		userService
			.newUser(req.body)
			.then((resp) => {
				const token = sign(resp, process.env.JWT_SECRET, {
					expiresIn: '6h',
				});
				return res.json({ token });
			})
			.catch((err) => {
				console.error(err);
				return res.status(500).json({ error: err.message });
			});
	});

	router.post('/refresh', (req, res) => {
		const token = req.headers['authorization']?.split('Bearer ')[1];
		try {
			const payload = verify(token, process.env.JWT_SECRET);
			if (payload.refreshing) {
				return userService
					.findUser(payload.username)
					.then((user) => {
						const token = sign(
							{ ...user, password: undefined },
							process.env.JWT_SECRET,
							{
								expiresIn: '6h',
							},
						);

						return res.json({ token });
					})
					.catch((err) => {
						return res.status(500).json({ error: err.message });
					});
			}
			return res.status(400).json({
				error: 'Invalid refresh token',
			});
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	});

	return router;
};
