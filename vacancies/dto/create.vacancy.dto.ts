export interface CreateVacancyDto {
  title: string;
  position: string;
  description: string;
  isActive?: boolean;
  location: string;
  createdAt?: Date;
  company: any;
}