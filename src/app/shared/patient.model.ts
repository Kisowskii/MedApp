import { Visit } from './doctors.visit.model';

export interface Patient {
  id: string;
  login: string;
  password: string;
  name?: string;
  lastname?: string;
  visits?: Visit[];
}
