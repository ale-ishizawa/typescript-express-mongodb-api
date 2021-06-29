import express from 'express';
import argon2 from 'argon2';
import debug from 'debug';

import vacanciesService from '../services/vacancies.service';

const log: debug.IDebugger = debug('app:vacancies-controller');

class VacanciesController {
  async listVacancies(req: express.Request, res: express.Response) {
    const vacancies = await vacanciesService.list(100, 0);
    res.status(200).send(vacancies);
  }

  async getVacancyById(req: express.Request, res: express.Response) {
    const vacancy = await vacanciesService.readById(req.body.id);
    res.status(200).send(vacancy);
  }

  async createVacancy(req: express.Request, res: express.Response) {
    const vacancyId = await vacanciesService.create(req.body);
    res.status(201).send({ id: vacancyId });
  }

  async patch(req: express.Request, res: express.Response) {
    log(await vacanciesService.patchById(req.body.id, req.body));
    res.status(204).send();
  }

  async put(req: express.Request, res: express.Response) {
    log(await vacanciesService.putById(req.body.id, req.body));
    res.status(204).send();
  }

  async removeVacancy(req: express.Request, res: express.Response) {
    log(await vacanciesService.deleteById(req.body.id));
    res.status(204).send();
  }
} 

export default new VacanciesController();