import { body, query } from "express-validator";

export const userRegistrationValidation = [
  body("email").isEmail().normalizeEmail(),
  body("username").trim().isLength({ min: 2, max: 8 }),
  body("password").isLength({ min: 5 }),
];

export const userLoginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

export const productValidation = [
  body("code").trim().notEmpty().isLength({ min: 3, max: 5 }),
  body("name").trim().notEmpty().isLength({ min: 4, max: 8 }),
  body("category").trim().notEmpty().isLength({ min: 4, max: 8 }),
  body("brand").trim().notEmpty().isLength({ min: 4, max: 6 }),
  body("model").trim().notEmpty().isLength({ min: 2, max: 6 }),
  body("price").isFloat({ gt: 0 }),
  body("stock").isInt({ gt: 1 }),
];

export const paginationValidation = [
  query("page")
    .isNumeric()
    .withMessage("Query parameter 'page' cannot be empty and must be a number"),
  query("per_page").isNumeric().withMessage("validationMessage.PER_PAGE_VALIDATION"),
];

export const jwtSecrete = process.env.JWT_SECRET || "dev-secret";
export const jwtExpirationTime = process.env.JWT_EXP_TIME || "24h";

export const appPort = process.env.PORT || "3000";
