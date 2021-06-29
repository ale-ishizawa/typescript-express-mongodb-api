import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import CompaniesMiddleware from './middleware/companies.middleware';
import CompaniesController from './controllers/companies.controller';
import BodyValidationMiddleware 
  from '../common/middleware/body.validation.middleware';
import { body } from 'express-validator';


export class CompaniesRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'CompaniesRoutes');
  }

  configureRoutes() {

    this.app
      .route('/companies')
      .get(CompaniesController.listCompanies)
      .post(
        body('name'),
        body('description'),
        body('website').optional(),
        body('email').isEmail(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        CompaniesController.createCompany
      );
      
    this.app.param('companyId', CompaniesMiddleware.extractCompanyId);
    this.app  
      .route('/companies/:companyId')
      .all(CompaniesMiddleware.validateCompanyExists)
      .get(CompaniesController.getCompanyById)
      .delete(CompaniesController.removeCompany);

    this.app.put('/companies/:companyId', [
      body('name').isString(),
      body('description').isString(),
      body('website').isString(),
      body('email').isEmail().isString(),
      body('isActive').isBoolean(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      CompaniesController.put
    ]);

    this.app.patch('/companies/:companyId', [
      body('name').isString().optional(),
      body('description').isString().optional(),
      body('website').isString().optional(),
      body('email').isEmail().isString().optional(),
      body('isActive').isBoolean().optional(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      CompaniesController.patch
    ]);

    return this.app;
  }
}