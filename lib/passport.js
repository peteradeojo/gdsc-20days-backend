const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../services/user');

/**
 * @param {passport} passport
 */
module.exports = (passport) => {
	const userService = new User();
	passport.use(
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: process.env.JWT_SECRET,
			},
			async (payload, done) => {
				try {
					const user = await userService.findUser(payload.username);

					if (!user) {
						return done(null, false);
					}

					return done(null, user);
				} catch (err) {
					return done(err, false);
				}
			},
		),
	);
};
