import { Visit } from '../shared/doctors.visit.model';

export interface User {
  id: string;
  login: string;
  password: string;
  name?: string;
  lastname?: string;
  city?: string;
  specjalizations?: [];
  visits?: Visit[];
}
