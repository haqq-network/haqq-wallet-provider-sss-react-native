export interface StorageInterface {
  getName(): string;

  getItem(key: string): Promise<string | null>;

  hasItem(key: string): Promise<boolean>;

  setItem(key: string, value: string): Promise<boolean>;

  removeItem(key: string): Promise<boolean>;
}

export type ProviderMpcOptions = {
  account: string;
  getPassword: () => Promise<string>;
  storage: StorageInterface;
};
