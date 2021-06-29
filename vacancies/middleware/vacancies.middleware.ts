import express from 'express';
import vacanciesService from '../services/vacancies.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:vacancies-controller');

class VacanciesMiddleware {
  
  async extractVacancyId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    req.body.id = req.params.vacancyId;
    next();
  }  

  async validateVacancyExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const vacancy = await vacanciesService.readById(req.params.vacancyId);
    if (vacancy) {
      next();
    } else {
      res.status(404).send({
        error: `Vacancy ${req.params.vacancyId} not found`,
      });
    }
  }
}

export default new VacanciesMiddleware();