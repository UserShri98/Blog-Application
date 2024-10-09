const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        if (!tokenCookieValue) {
            return next();  // No token, continue to the next middleware
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;  // Attach user info to req object
        } catch (error) {
            console.error('Invalid token:', error.message);  // Log the error for debugging
            req.user = null;  // Optionally set req.user to null if token validation fails
        }

        return next();  // Continue to the next middleware
    };
}

module.exports = {
    checkForAuthenticationCookie
};
