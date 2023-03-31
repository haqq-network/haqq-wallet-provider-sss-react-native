export interface StorageInterface {
  getName(): string;

  getItem(key: string): Promise<string | null>;

  hasItem(key: string): Promise<boolean>;

  setItem(key: string, value: string): Promise<boolean>;

  removeItem(key: string): Promise<boolean>;
}

export type ProviderSSSOptions = {
  account: string;
  getPassword: () => Promise<string>;
  storage: StorageInterface;
};

export type Share = {
  share: string;
  shareIndex: string;
  polynomialID: string;
};

export type ShareEncrypted = {
  nonce: string;
  shareIndex: string;
  polynomialID: string;
  publicShare: string;
};
