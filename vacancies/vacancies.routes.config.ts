import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import VacanciesMiddleware from './middleware/vacancies.middleware';
import VacanciesController from './controllers/vacancies.controller';
import BodyValidationMiddleware 
  from '../common/middleware/body.validation.middleware'; 
import { body } from 'express-validator';


export class VacanciesRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'VacanciesRoutes');
  }

  configureRoutes() {

    this.app
      .route('/vacancies')
      .get(VacanciesController.listVacancies)
      .post(
        body('title'),
        body('position')
          .isLength({ min: 2 }),
        body('description'),
        body('location'),
        body('company'),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      VacanciesController.createVacancy
    );
      
    this.app.param('vacancyId', VacanciesMiddleware.extractVacancyId);
    this.app  
      .route('/vacancies/:vacancyId')
      .all(
        VacanciesMiddleware.validateVacancyExists
      )
      .get(VacanciesController.getVacancyById)
      .delete(VacanciesController.removeVacancy);

    this.app.put('/vacancies/:vacancyId', [
      body('title').isString(),
      body('position').isString()
        .isLength({ min: 3 }),
      body('description').isString(),
      body('location').isString(),
      body('company').isString(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      VacanciesController.put
    ]);

    this.app.patch('/vacancies/:vacancyId', [
      body('title').isString().optional(),
      body('position').isString()
        .isLength({ min: 3 })
        .optional(),
      body('description').isString().optional(),
      body('location').isString().optional(),
      body('company').optional(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      VacanciesController.patch
    ]);

    return this.app;
  }
}