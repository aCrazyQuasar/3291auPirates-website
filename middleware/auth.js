export function requireLogin(req, res, next) {
    if (!req.session.loggedIn) {
        return res.status(401).sendFile(
            path.join(__dirname, "../public/errors/401.html")
        );
    }

    next();
}