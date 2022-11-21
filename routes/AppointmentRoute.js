const express = require("express");
const {
  deleteAppointment,
  getAppointment,
  updateAppointment,
  createAppointment,
  getAllAppointments,
} = require("../controllers/AppointmentController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.route("/appointment/create").post(createAppointment);

router.route("/appointments/all").get(getAllAppointments);

router
  .route("/appointment/:id")
  .get(getAppointment)
  .put(updateAppointment)
  .delete(deleteAppointment);

module.exports = router;
