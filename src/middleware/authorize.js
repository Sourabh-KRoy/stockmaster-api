// middleware/authorize.js
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.admin || !req.admin.role) {
        return res.status(401).json({ message: 'Unauthorized: No user information found' });
      }

      if (!allowedRoles.includes(req.admin.role)) {
        return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
      }

      next();
    } catch (error) {
      console.error('Authorization Middleware Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};

export default authorize;
