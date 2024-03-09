import { InstaglanceBot } from './bot';
import { IEnvConfigService } from './config/env.config.interface';
import { EnvConfigService } from './config/env.config.service';
import { SocksProxyAgent } from 'socks-proxy-agent';

class Proxy {
	socsAgent: SocksProxyAgent;
	constructor(private readonly configService: IEnvConfigService) {
		this.socsAgent = new SocksProxyAgent(
			this.configService.get('PROXY_URL')
		);
	}
}

const envConfigService = new EnvConfigService();
const botConfig = {
	client: {
		baseFetchConfig: {
			agent: new Proxy(envConfigService),
			compress: true,
		},
	},
};

const socsAgent = new Proxy(envConfigService);
const bot = new InstaglanceBot(envConfigService, botConfig);
bot.init();
