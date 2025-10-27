export abstract class BaseAdapter<TInput, TOutput> {
  abstract adapt(data: TInput): TOutput;

  adaptMany(data: TInput[]): TOutput[] {
    return data.map(item => this.adapt(item));
  }
}

export type AdapterConstructor<TInput, TOutput> = new () => BaseAdapter<
  TInput,
  TOutput
>;
