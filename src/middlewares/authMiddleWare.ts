import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * ✅ Middleware: Verifies JWT and attaches user payload to req.user
 */
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided or bad format" });
  } else {
    const token = header.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      res.status(500).json({ message: "JWT_SECRET not defined" });
    } else {
      try {
        const payload = jwt.verify(token, secret);
        (req as any).user = payload;
        next();
      } catch (err) {
        console.error("JWT verification failed:", err);
        res.status(401).json({ message: "Invalid or expired token" });
      }
    }
  }
};

interface CustomRequest extends Request {
  user?: any;
}

export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  }
};

/**
 * ✅ Middleware: Checks if user has at least one of the allowed roles
 */
const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !user.role) {
      res.status(403).json({ message: "Forbidden: no user role found" });
    } else {
      const userRoles = Array.isArray(user.role) ? user.role : [user.role];
      const hasRole = roles.some((role) => userRoles.includes(role));

      if (!hasRole) {
        res.status(403).json({ message: "Forbidden: insufficient role" });
      } else {
        next();
      }
    }
  };
};

const authorize = authenticate;

// ✅ Exports
export { authenticate, authorize, authorizeRole };
