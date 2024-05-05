import { InstaglanceBot } from './bot';
import { EnvConfig } from './config/env.config.service';
import { botConfigForProxy } from './proxy';

const envConfigService = EnvConfig.getInstance();
const NODE_ENV = envConfigService.get('NODE_ENV');
let config = {};
if (NODE_ENV === 'production') config = botConfigForProxy;
const bot = new InstaglanceBot(config);
