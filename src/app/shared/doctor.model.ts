import { Visit } from './visit.model';

export interface Doctor {
  id: string;
  login: string;
  password: string;
  name?: string;
  lastname?: string;
  city?: string;
  specjalizations?: string[];
  visits?: Visit[];
}
