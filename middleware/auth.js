export function requireLogin(req, res, next) {
    if (!req.session.loggedIn) {
        return res.sendStatus(401);
    }

    next();
}