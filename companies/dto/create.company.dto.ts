export interface CreateCompanyDto {
  name: string;
  description: string;
  website?: string;
  email: string;
  isActive?: boolean;
}