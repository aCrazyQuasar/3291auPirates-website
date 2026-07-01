export function requireLogin(req, res, next) {
    if (!req.session.loggedIn) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }
    next();
}
export function requireLoginPage(req, res, next) {
    if (!req.session.loggedIn) {
        return res.redirect("/401");
    }
    next();
}