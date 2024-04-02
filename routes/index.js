const {Router} = require('express');

const router = Router();

module.exports = () => {
	router.get("/hello", (req, res) => {
		return res.send("<b>Hello GDSC</b>");
	});

	return router;
};
