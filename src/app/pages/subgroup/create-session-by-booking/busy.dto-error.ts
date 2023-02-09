export interface BusyErrorDto {
  headers: Headers;
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  name: string;
  message: string;
  error: BusyErrorDtoError;
}

interface BusyErrorDtoError {
  data: null;
  error: ErrorError;
}

interface ErrorError {
  status: number;
  name: string;
  message: string;
  details: Details;
}

interface Details {
  busy: Busy;
}

interface Busy {
  begin: string;
  id: number;
  end: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  user: Creator;
  creator: Creator;
}

interface Creator {
  id: number;
  username: string;
  email: string;
  provider: string;
  password: string;
  resetPasswordToken: null;
  confirmationToken: null;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  first_name: string;
  last_name: string;
  patronymic: string;
}

interface Headers {
  normalizedNames: NormalizedNames;
  lazyUpdate: null;
}

interface NormalizedNames {}
