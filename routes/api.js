const {Router} = require('express');

const router = Router();

module.exports = () => {
	router.get('/hello', (req, res) => {
		return res.json({message: 'Hello GDSC'});
	});
	return router;
};
