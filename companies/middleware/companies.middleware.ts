import express from 'express';
import companiesService from '../services/companies.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:companies-controller');

class CompaniesMiddleware {
  
  async extractCompanyId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    req.body.id = req.params.companyId;
    next();
  }  

  async validateCompanyExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const company = await companiesService.readById(req.params.companyId);
    if (company) {
      next();
    } else {
      res.status(404).send({
        error: `Company ${req.params.companyId} not found`,
      });
    }
  }
}

export default new CompaniesMiddleware();