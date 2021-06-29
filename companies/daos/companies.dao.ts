import debug from 'debug';
import { CreateCompanyDto } from '../dto/create.company.dto';
import { PutCompanyDto } from '../dto/put.company.dto';
import { PatchCompanyDto } from '../dto/patch.company.dto';
import mongooseService from '../../common/services/mongoose.service';

const log: debug.IDebugger = debug('app:in-memory-dao');

class CompaniesDao {
  Schema = mongooseService.getMongoose().Schema;

  companySchema = new this.Schema({
    name: String,
    description: String,
    website: String,
    email: String,
    isActive: Boolean
  });

  Company = mongooseService.getMongoose().model('Companies', this.companySchema)

  constructor() {
    log('Created new instance of CompaniesDao');
  }

  async addCompany(companyFields: CreateCompanyDto) {
    const company = new this.Company({
      ...companyFields,
      isActive: true
    });
    await company.save();
    return company._id;
  }

  async getCompanyById(companyId: string) {
    return this.Company.findOne({ _id: companyId }).populate('Company').exec();    
  }

  async getCompanies(limit = 25, page = 0) {
    return this.Company.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async updateCompanyById(
    companyId: string,
    companyFields: PatchCompanyDto | PutCompanyDto
  ) {
    const existingCompany = await this.Company.findOneAndReplace(
      { _id: companyId },
      { $set: companyFields },
      { new: true } //return the updated object
    ).exec();
    return existingCompany;
  }  

  async removeCompanyById(companyId: string) {
    return this.Company.deleteOne({ _id: companyId }).exec();
  }
}

export default new CompaniesDao();


