export interface PutVacancyDto {
  title: string;
  position: string;
  description: string;
  isActive: boolean;
  location: string;
  createdAt: Date;
  company: any;
}