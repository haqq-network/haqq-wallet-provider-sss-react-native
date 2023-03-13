import {ServiceProviderArgs, TorusStorageLayerArgs} from '@tkey/common-types';
import ThresholdKey from '@tkey/core';
import SecurityQuestionsModule from '@tkey/security-questions';
import ServiceProvider from '@tkey/service-provider-base';
import {ShareSerializationModule} from '@tkey/share-serialization';
import {ShareTransferModule} from '@tkey/share-transfer';
import TorusStorageLayer from '@tkey/storage-layer-torus';
import BN from 'bn.js';

export async function initializeTKey(
  postboxKey: string,
  serviceProviderOptions: ServiceProviderArgs,
  storageOptions: TorusStorageLayerArgs,
) {
  const serviceProvider = new ServiceProvider(serviceProviderOptions);

  const storageLayer = new TorusStorageLayer(storageOptions);

  const shareTransferModule = new ShareTransferModule();
  const shareSerializationModule = new ShareSerializationModule();
  const securityQuestionsModule = new SecurityQuestionsModule();

  const tKey = new ThresholdKey({
    serviceProvider,
    storageLayer,
    modules: {
      shareTransfer: shareTransferModule,
      shareSerializationModule,
      securityQuestions: securityQuestionsModule,
    },
  });

  tKey.serviceProvider.postboxKey = new BN(postboxKey, 16);
  await tKey.initialize();

  return {tKey, securityQuestionsModule};
}
