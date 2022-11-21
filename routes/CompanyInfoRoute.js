const express = require("express");

const {
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/CompanyInfoController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.route("/company/create").post(createCompany);
router.route("/company").get(getCompany);

router
  .route("/company/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateCompany)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCompany);

module.exports = router;
