import { PutUserDto } from './put.user.dto';

//Partial creates a new type copying another type and making all its fields 
//optional
export interface PatchUserDto extends Partial<PutUserDto> {};