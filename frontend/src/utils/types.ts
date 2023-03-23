import type { AxiosInstance } from "axios";

export interface IProfile {
  id: number;
  email: string;
  fullName: string | null;
}

export interface IQueryString {
  take?: number;
  skip?: number;
}

export interface IServiceOption {
  baseUrl: string;
}

export interface IService {
  client: AxiosInstance;
  baseUrl: string;
}
