import { InstaglanceBot } from './bot';
import { IEnvConfig } from './config/env.config.interface';
import { EnvConfig } from './config/env.config.service';
import { SocksProxyAgent } from 'socks-proxy-agent';

class Proxy {
	socsAgent: SocksProxyAgent;
	constructor(private readonly configService: IEnvConfig) {
		this.socsAgent = new SocksProxyAgent(
			this.configService.get('PROXY_URL')
		);
	}
}

const envConfigService = new EnvConfig();
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
