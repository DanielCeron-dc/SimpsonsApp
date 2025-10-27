import {AxiosRequestConfig} from 'axios';
import {BaseAdapter} from './BaseAdapter';

export interface HttpClient {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post?<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put?<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete?<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

export abstract class BaseService<TDto, TModel> {
  protected constructor(
    protected readonly client: HttpClient,
    protected readonly adapter: BaseAdapter<TDto, TModel>,
  ) {}

  protected map(dto: TDto): TModel {
    return this.adapter.adapt(dto);
  }

  protected mapMany(dtos: TDto[]): TModel[] {
    return this.adapter.adaptMany(dtos);
  }
}

export default BaseService;
