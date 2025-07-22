// import { Request, Response } from "express"; // Request, Response → from Express; used to type req and res.
// import bcrypt from "bcrypt"; // bcrypt → used to hash and compare passwords securely.
// import {
//   isValidEmail,
//   isValidPhone,
//   isValidCivilID,
//   validateRequiredFields,
// } from "../utils/Validation"; // Utility functions from ../utils/Validation help with checking format and missing fields.
// import Patients from "../models/Patients"; // Patient → the Mongoose model that represents users (patients) in MongoDB.

// // Interface for registration request body
// interface RegisterRequest {
//   name: string;
//   email: string;
//   phone: string;
//   civilID: string;
//   password: string;
//   role: string;
// }

// /**
//  * Register a new user
//  * POST /auth/register
//  */
// export const register = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { name, email, phone, civilID, password, role }: RegisterRequest =
//       req.body;

//     // 1. Validate required fields
//     const fieldValidation = validateRequiredFields({ name, civilID, password });
//     if (!fieldValidation.isValid) {
//       res.status(422).json({
//         success: false,
//         message: `Missing required fields: ${fieldValidation.missingFields.join(
//           ", "
//         )}`,
//         missingFields: fieldValidation.missingFields,
//       });
//       return;
//     }

//     // 2. Validate email format
//     if (!isValidEmail(email)) {
//       res.status(400).json({
//         success: false,
//         message: "Invalid email format",
//       });
//       return;
//     }

//     // 3. Validate phone format
//     if (!isValidPhone(phone)) {
//       res.status(400).json({
//         success: false,
//         message: "Invalid phone number format",
//       });
//       return;
//     }

//     // 4. Validate Civil ID format
//     if (!isValidCivilID(civilID)) {
//       res.status(400).json({
//         success: false,
//         message: "Civil ID must be exactly 12 digits",
//       });
//       return;
//     }

//     // 5. Check if user with this Civil ID already exists
//     const existingPatient = await Patients.findOne({ civilID });
//     if (existingPatient) {
//       res.status(409).json({
//         success: false,
//         message: "User with this Civil ID already exists",
//       });
//       return;
//     }

//     // 6. Check if user with this email already exists
//     const existingEmail = await Patients.findOne({
//       email: email.toLowerCase(),
//     });
//     if (existingEmail) {
//       res.status(409).json({
//         success: false,
//         message: "User with this email already exists",
//       });
//       return;
//     }

//     // 7. Hash the password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // 8. Create new user
//     const newUser = new Patients({
//       name: name.trim(),
//       email: email.toLowerCase().trim(),
//       phone: phone,
//       civilID: civilID,
//       password: hashedPassword,
//       role: role?.trim() || "Patient",
//     });

//     // 9. Save user to database
//     const savedUser = await newUser.save();

//     // 10. Create user response object (without password)
//     const userResponse = {
//       _id: savedUser._id,
//       name: savedUser.name,
//       email: savedUser.email,
//       phone: savedUser.phone,
//       civilID: savedUser.civilID,
//       createdAt: savedUser.createdAt,
//       updatedAt: savedUser.updatedAt,
//     };

//     // 11. Return success response
//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user: userResponse,
//     });
//   } catch (error) {
//     console.error("Registration error:", error);

//     // Handle Mongoose validation errors
//     if (error instanceof Error && error.name === "ValidationError") {
//       res.status(400).json({
//         success: false,
//         message: "Validation error",
//         errors: error.message,
//       });
//       return;
//     }

//     // Handle duplicate key errors
//     if (error instanceof Error && error.name === "MongoServerError") {
//       const mongoError = error as any;
//       if (mongoError.code === 11000) {
//         const field = Object.keys(mongoError.keyPattern)[0];
//         res.status(409).json({
//           success: false,
//           message: `User with this ${field} already exists`,
//         });
//         return;
//       }
//     }

//     // Generic server error
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// /**
//  * Login as a user
//  * POST /auth/login
//  */
// export const login = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { civilID, password } = req.body;

//     // 1. Validate required input
//     if (!civilID || !password) {
//       res.status(422).json({
//         success: false,
//         message: "Civil ID and password are required",
//       });
//       return;
//     }

//     // 2. Check if user exists by civilID
//     const user = await Patients.findOne({ civilID });
//     if (!user) {
//       res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//       return;
//     }

//     // 3. Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       res.status(401).json({
//         success: false,
//         message: "Incorrect password",
//       });
//       return;
//     }

//     // 4. Create response object (no token yet)
//     const userResponse = {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       civilID: user.civilID,
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt,
//     };

//     // 👉 5. Generate JWT token
//     const jwt = require("jsonwebtoken");
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     // 6. Respond with success
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: userResponse,
//     });
//   } catch (error) {
//     console.error("Login error:", error);

//     // Generic server error
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  isValidEmail,
  isValidPhone,
  isValidCivilID,
  validateRequiredFields,
} from "../utils/Validation";
import Patients from "../models/Patients";
import jwt from "jsonwebtoken";

// Interface for registration request body
interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  civilID: string;
  password: string;
  role: string;
}

/**
 * Register a new user
 * POST /auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, civilID, password, role }: RegisterRequest =
      req.body;

    // 1. Validate required fields
    const fieldValidation = validateRequiredFields({ name, civilID, password });
    if (!fieldValidation.isValid) {
      res.status(422).json({
        success: false,
        message: `Missing required fields: ${fieldValidation.missingFields.join(
          ", "
        )}`,
        missingFields: fieldValidation.missingFields,
      });
      return;
    }

    // 2. Validate email format
    if (!isValidEmail(email)) {
      res.status(400).json({ success: false, message: "Invalid email format" });
      return;
    }

    // 3. Validate phone format
    if (!isValidPhone(phone)) {
      res
        .status(400)
        .json({ success: false, message: "Invalid phone number format" });
      return;
    }

    // 4. Validate Civil ID format
    if (!isValidCivilID(civilID)) {
      res
        .status(400)
        .json({
          success: false,
          message: "Civil ID must be exactly 12 digits",
        });
      return;
    }

    // 5. Check if user with this Civil ID already exists
    const existingPatient = await Patients.findOne({ civilID });
    if (existingPatient) {
      res
        .status(409)
        .json({
          success: false,
          message: "User with this Civil ID already exists",
        });
      return;
    }

    // 6. Check if email is already used
    const existingEmail = await Patients.findOne({
      email: email.toLowerCase(),
    });
    if (existingEmail) {
      res
        .status(409)
        .json({
          success: false,
          message: "User with this email already exists",
        });
      return;
    }

    // 7. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 8. Create new user
    const newUser = new Patients({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone,
      civilID,
      password: hashedPassword,
      role: role?.trim() || "Patient",
    });

    // 9. Save user to DB
    const savedUser = await newUser.save();

    // 10. Prepare response
    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      phone: savedUser.phone,
      civilID: savedUser.civilID,
      role: savedUser.roles,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error?.name === "ValidationError") {
      res
        .status(400)
        .json({
          success: false,
          message: "Validation error",
          errors: error.message,
        });
      return;
    }

    if (error?.name === "MongoServerError" && error?.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res
        .status(409)
        .json({
          success: false,
          message: `User with this ${field} already exists`,
        });
      return;
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Login as a user
 * POST /auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { civilID, password } = req.body;

    // 1. Validate input
    if (!civilID || !password) {
      res
        .status(422)
        .json({
          success: false,
          message: "Civil ID and password are required",
        });
      return;
    }

    // 2. Find user
    const user = await Patients.findOne({ civilID });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Incorrect password" });
      return;
    }

    // 4. Generate JWT with role
    const token = jwt.sign(
      { id: user._id, role: user.roles }, // ✅ include role here
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    // 5. Return success
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      civilID: user.civilID,
      role: user.roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
