const express = require("express");
const {
  createQuotation,
  getQuotation,
  updateQuotation,
  deleteQuotation,
  getAllQuotations,
} = require("../controllers/QuotationController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.route("/quotation/create").post(createQuotation);

router.route("/quotations/all").get(getAllQuotations);

router
  .route("/quotation/:id")
  .get(getQuotation)
  .put(updateQuotation)
  .delete(deleteQuotation);

module.exports = router;
