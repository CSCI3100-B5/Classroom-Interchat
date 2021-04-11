const express = require('express');
const { validate } = require('express-validation');
const paramValidation = require('./token.validation');
const tokenCtrl = require('./token.controller');
const { requireAccessToken } = require('./../helpers/requireAuth');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/:userId')
  /** GET /api/token/:userId - Get all tokens of a given user id
  */
  .get(requireAccessToken, validate(paramValidation.getTokens), tokenCtrl.getUserTokens);

router.route('/:tokenId/invalidate')
  /** PATCH /api/token/:tokenId/invalidate - Sets isValid of a token to false
  */
  .patch(requireAccessToken, validate(paramValidation.invalidateToken), tokenCtrl.setTokenFalse);

/** Load user when API with userId route parameter is hit */
router.param('userId', tokenCtrl.loadUser);

/** Load token when API with tokenId route parameter is hit */
router.param('tokenId', tokenCtrl.loadToken);

module.exports = router;
