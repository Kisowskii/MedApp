import { Visit } from './visit.model';

export interface Patient {
  id: string;
  login: string;
  password: string;
  name?: string;
  lastname?: string;
  visits?: Visit[];
}
