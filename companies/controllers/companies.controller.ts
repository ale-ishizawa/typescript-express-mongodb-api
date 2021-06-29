import express from 'express';
import argon2 from 'argon2';
import debug from 'debug';

import companiesService from '../services/companies.service';

const log: debug.IDebugger = debug('app:companies-controller');

class CompaniesController {
  async listCompanies(req: express.Request, res: express.Response) {
    const companies = await companiesService.list(100, 0);
    res.status(200).send(companies);
  }

  async getCompanyById(req: express.Request, res: express.Response) {
    const company = await companiesService.readById(req.body.id);
    res.status(200).send(company);
  }

  async createCompany(req: express.Request, res: express.Response) {
    const companyId = await companiesService.create(req.body);
    res.status(201).send({ id: companyId });
  }

  async patch(req: express.Request, res: express.Response) {
    log(await companiesService.patchById(req.body.id, req.body));
    res.status(204).send();
  }

  async put(req: express.Request, res: express.Response) {
    log(await companiesService.putById(req.body.id, req.body));
    res.status(204).send();
  }

  async removeCompany(req: express.Request, res: express.Response) {
    log(await companiesService.deleteById(req.body.id));
    res.status(204).send();
  }
} 

export default new CompaniesController();