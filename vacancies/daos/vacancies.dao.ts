import debug from 'debug';
import { CreateVacancyDto } from '../dto/create.vacancy.dto';
import { PutVacancyDto } from '../dto/put.vacancy.dto';
import { PatchVacancyDto } from '../dto/patch.vacancy.dto';
import mongooseService from '../../common/services/mongoose.service';

const log: debug.IDebugger = debug('app:in-memory-dao');

class VacanciesDao {
  Schema = mongooseService.getMongoose().Schema;

  vacancySchema = new this.Schema({
    title: String,
    description: String,
    location: String,
    createdAt: Date,
    isActive: Boolean,
    position: String,
    company: {
      type: this.Schema.Types.ObjectId,
      ref: 'Companies',
      require: true,
    },
  });

  Vacancy = mongooseService.getMongoose().model('Vacancies', this.vacancySchema)

  constructor() {
    log('Created new instance of VacanciesDao');
  }

  async addVacancy(vacancyFields: CreateVacancyDto) {   
    const vacancy = new this.Vacancy({
      ...vacancyFields,
      isActive: true,
      createdAt: new Date()
    });
    await vacancy.save();
    return vacancy._id;
  }

  async getVacancyById(vacancyId: string) {
    let test =  await this.Vacancy.findOne({ _id: vacancyId })
      .populate('company')
      .exec();    
    return test;
  }

  async getVacancies(limit = 25, page = 0) {
    return this.Vacancy.find()
      .populate('company')
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async updateVacancyById(
    vacancyId: string,
    vacancyFields: PatchVacancyDto | PutVacancyDto
  ) {
    const existingVacancy = await this.Vacancy.findOneAndUpdate(
      { _id: vacancyId },
      { $set: vacancyFields },
      { new: true } //return the updated object
    ).exec();
    return existingVacancy;
  }  

  async removeVacancyById(vacancyId: string) {
    return this.Vacancy.deleteOne({ _id: vacancyId }).exec();
  }
}

export default new VacanciesDao();


