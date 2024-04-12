const passport = require('passport');
const { IsAdmin } = require('../middleware/IsAdmin');

const router = require('express').Router();

module.exports = () => {
	router.get('/hello', (req, res) => {
		return res.send('<b>Hello GDSC</b>');
	});

	router.get(
		'/earnings',
		passport.authenticate('jwt', { session: false }),
		IsAdmin,
		async (req, res) => {
			return res.json({});
		}
	);

	return router;
};
