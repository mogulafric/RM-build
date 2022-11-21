const express = require("express");
const {
  createService,
  getAllServices,
  getAdminServices,
  updateServices,
  deleteService,
  getSingleService,
  createServiceReview,
  getSingleServiceReviews,
  deleteServiceReview,
} = require("../controllers/ServiceController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/services/create").post(createService);

router.route("/services").get(getAllServices);
router.route("/admin/services").get(getAdminServices);

router.route("/services/:id").put(updateServices);

router.route("/services/:id").delete(deleteService).get(getSingleService);

router.route("/service/review").post(createServiceReview);

router
  .route("/reviews")
  .get(getSingleServiceReviews)
  .delete(deleteServiceReview);

module.exports = router;
