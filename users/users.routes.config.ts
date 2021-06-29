import { CommonRoutesConfig } from '../common/common.routes.config';
import UsersController from './controllers/users.controller';
import UsersMiddleware from './middleware/users.middleware';
import express from 'express';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import jwtMiddleware from '../auth/middleware/jwt.middleware';
import { body } from 'express-validator';

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'UsersRoutes');
  }

  configureRoutes() {
    
    this.app
      .route('/users')
      .get(
        jwtMiddleware.validJWTNeeded,
        UsersController.listUsers
      )
      .post(
        body('email').isEmail(),
        body('password')
          .isLength({ min: 6 })
          .withMessage('Password deve conter no mínimo 5 caracteres'),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        UsersMiddleware.validateEmailExist,
        UsersController.createUser
      );
      
    this.app.param('userId', UsersMiddleware.extractUserId);
    this.app
      .route('/users/:userId')
      .all(
        jwtMiddleware.validJWTNeeded,
        UsersMiddleware.validateUserExists
      )
      .get(UsersController.getUserById)
      .delete(UsersController.removeUser);

    this.app.put('/users/:userId', [
      body('email').isEmail(),
      body('password')
        .isLength({ min: 6 })
        .withMessage('Password deve conter no mínimo 5 caracteres'),
      body('firstName').isString(),
      body('lastName').isString(),
      body('permissionFlags').isInt(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      UsersMiddleware.validateEmailBelongToSameUser,
      UsersController.put,
    ]);

    this.app.patch('/users/:userId', [
        body('email').isEmail().optional(),
        body('password')
          .isLength({ min: 6 })
          .withMessage('Password deve conter no mínimo 5 caracteres')
          .optional(),
        body('firstName').isString().optional(),
        body('lastName').isString().optional(),
        body('permissionFlags').isInt().optional(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        UsersMiddleware.validatePatchEmail,
        UsersController.patch,
    ]);

    return this.app;
  }
}