import { DotenvParseOutput, config } from 'dotenv';
import { IEnvConfigService } from './env.config.interface';

export class EnvConfigService implements IEnvConfigService {
	private config: DotenvParseOutput;
	constructor() {
		const { error, parsed } = config();
		if (error) throw new Error("Can't find .env");
		if (!parsed) throw new Error('.env is empty');
		this.config = parsed;
	}
	get(key: string): string {
		const result = this.config[key];
		if (!result) throw new Error('No such key in .env');
		return result;
	}
}
