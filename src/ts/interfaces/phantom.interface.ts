import { DisplayEncoding, PhantomEvent, PhantomRequestMethod } from 'ts/types/phantom';

export interface ConnectOpts {
  onlyIfTrusted: boolean;
}

export interface PhantomProvider {
  signMessage: (message: Uint8Array | string, display?: DisplayEncoding) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<void>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<any>;
}
