import { convertEnvNumber } from '@helpers/index';
import { IAppConfig } from './interfaces';

export default (): {
  APP_CONFIG: IAppConfig;
} => ({
  APP_CONFIG: {
    SERVICE_TAG: process.env.SERVICE_TAG || 'search-worker',
    PORT: convertEnvNumber(process.env.PORT) ?? 3000,
    MANGA_SYNC_CHUNK_SIZE:
      convertEnvNumber(process.env.MANGA_SYNC_CHUNK_SIZE) ?? 100,
  },
});
