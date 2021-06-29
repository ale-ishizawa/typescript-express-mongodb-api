import VacanciesDao from '../daos/vacancies.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateVacancyDto } from '../dto/create.vacancy.dto';
import { PutVacancyDto } from '../dto/put.vacancy.dto';
import { PatchVacancyDto } from '../dto/patch.vacancy.dto';

class VacanciesService implements CRUD {
  async create(resource: CreateVacancyDto) {
    return VacanciesDao.addVacancy(resource);
  }

  async deleteById(id: string) {
    return VacanciesDao.removeVacancyById(id);
  }

  async list(limit: number, page: number) {
    return VacanciesDao.getVacancies(limit, page);
  }

  async patchById(id: string, resource: PatchVacancyDto) {
    return VacanciesDao.updateVacancyById(id, resource);
  }

  async readById(id: string) {
    return VacanciesDao.getVacancyById(id);
  }

  async putById(id: string, resource: PutVacancyDto) {
    return VacanciesDao.updateVacancyById(id, resource);
  }

}

export default new VacanciesService();