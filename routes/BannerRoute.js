const express = require("express");

const {
  createBanner,
  displayBanner,
  getAdminBanners,
  updateBanner,
  deleteBanner,
  getSingleBanner,
} = require("../controllers/BannerController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/banner/create").post(createBanner);
router.route("/fetch/banner").get(displayBanner);
router.route("/banners").get(getAdminBanners);
router.route("/banners/:id").put(updateBanner);
router.route("/banners/:id").delete(deleteBanner).get(getSingleBanner);

module.exports = router;
