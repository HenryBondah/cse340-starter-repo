const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
body("account_email")
  .trim()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid email is required.")
  .custom(async (account_email) => {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists){
      throw new Error("Email exists. Please log in or use different email")
    }
  }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
  validate.checkLoginData = async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav(); // Ensure getNav is correctly defined and exported in your utilities
        res.render("account/login", {
            errors: errors.array(),
            title: "Login",
            nav,
        });
    } else {
        next();
    }
};
  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
  validate.checkRegData = async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav(); // Ensure getNav is correctly defined and exported in your utilities
        res.render("account/login", {
            errors: errors.array(),
            title: "Login",
            nav,
        });
    } else {
        next();
    }
};

  /* ********************************
 * Login Data Validation Rules
 ******************************** */
validate.loginRules = () => {
  return [
    // Email must be valid
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email address."),
    
    // Password is required
    body("account_password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Password is required.")
  ];
}
  
  module.exports = validate