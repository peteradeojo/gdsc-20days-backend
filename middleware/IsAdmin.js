/**
 * @type {import('express').RequestHandler} IsAdmin
 */
const IsAdmin = (req, res, next) => {
	if (!req.user || req.user.is_admin !== 1) {
		return res.status(403).json({
			message: 'Forbidden',
		});
	}

	return next();
};

module.exports = { IsAdmin };
