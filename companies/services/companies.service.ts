import CompaniesDao from '../daos/companies.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateCompanyDto } from '../dto/create.company.dto';
import { PutCompanyDto } from '../dto/put.company.dto';
import { PatchCompanyDto } from '../dto/patch.company.dto';

class CompaniesService implements CRUD {
  async create(resource: CreateCompanyDto) {
    return CompaniesDao.addCompany(resource);
  }

  async deleteById(id: string) {
    return CompaniesDao.removeCompanyById(id);
  }

  async list(limit: number, page: number) {
    return CompaniesDao.getCompanies(limit, page);
  }

  async patchById(id: string, resource: PatchCompanyDto) {
    return CompaniesDao.updateCompanyById(id, resource);
  }

  async readById(id: string) {
    return CompaniesDao.getCompanyById(id);
  }

  async putById(id: string, resource: PutCompanyDto) {
    return CompaniesDao.updateCompanyById(id, resource);
  }

}

export default new CompaniesService();