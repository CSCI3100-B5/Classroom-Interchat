const express = require('express');
const { validate } = require('express-validation');
const paramValidation = require('./token.validation');
const tokenCtrl = require('./token.controller');
const { requireAccessToken, requireAdminAccess } = require('./../helpers/requireAuth');

// TODO: GUIDE: you may copy this file to make your xxx.route.js

const router = express.Router(); // eslint-disable-line new-cap

router.route('/:userId')
  /** GET /api/token/:userId - Get all tokens of a given user id
  */
  .post(requireAccessToken, tokenCtrl.getUserTokens);

router.route('/:tokenId/invalidate')
  /** PATCH /api/token/:tokenId/invalidate - Sets isValid of a token to false
  */
  .PATCH(requireAccessToken, validate(paramValidation.invalidateToken), tokenCtrl.setTokenFalse);

/** Load user when API with userId route parameter is hit */
router.param('userId', tokenCtrl.loadUser);

/** Load token when API with tokenId route parameter is hit */
router.param('tokenId', tokenCtrl.loadToken);

module.exports = router;
