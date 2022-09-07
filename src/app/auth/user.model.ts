import { Visit } from '../shared/visit.model';

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
