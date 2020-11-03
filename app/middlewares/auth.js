const Token = require('../models/token');

async function auth(req, res, next) {
    req.IsAuth = false;
    const token = req.cookies['user_session']

    if (!token)
        return next()

    const token_blacklist = await Token.findByPk(token, {attributes: ['token']});
    if (token_blacklist)
        return next();

    const solved = Token.solveToken(token);

    if (!solved.ok)
        return next();

    req.user = solved.decoded;
    req.IsAuth = solved.ok;
    return next();
}

module.exports = auth;