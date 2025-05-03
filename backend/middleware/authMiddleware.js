const authMiddleware = (req, res, next) => {
    if (req.session && req.session.userId) {
        // User is authenticated, proceed to the next middleware or route handler
        return next();
    } else {
        // User is not authenticated, return a 401 Unauthorized response
        return res.status(401).json({ error: 'Unauthorized access' });
    }
};

module.exports = authMiddleware;
