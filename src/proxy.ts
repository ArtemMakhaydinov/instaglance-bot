import { InstaglanceBot } from './bot';
import { IEnvConfig } from './config/env.config.interface';
import { EnvConfig } from './config/env.config.service';
import { SocksProxyAgent } from 'socks-proxy-agent';

class Proxy {
	socsAgent: SocksProxyAgent;
	envConfigService: IEnvConfig;
	constructor() {
		this.envConfigService = EnvConfig.getInstance();
		this.socsAgent = new SocksProxyAgent(this.envConfigService.get('PROXY_URL'));
	}
}

export const botConfigForProxy = {
	client: {
		baseFetchConfig: {
			agent: new Proxy(),
			compress: true,
		},
	},
};
