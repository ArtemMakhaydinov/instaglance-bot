import { Command } from './commands/command.class';
import { StartCommand } from './commands/start.command';
import { IEnvConfigService } from './config/env.config.interface';
import { Bot } from 'grammy';
import { EnvConfigService } from './config/env.config.service';

class InstaglanceBot {
	private bot: any;
	commands: Command[] = [];

	constructor(private readonly envConfigService: IEnvConfigService) {
		this.bot = new Bot(this.envConfigService.get('TOKEN'));
	}

	init() {
		this.commands = [new StartCommand(this.bot)];
		for (const command of this.commands) {
			command.handle();
		}

		this.bot.start();
	}
}

const bot = new InstaglanceBot(new EnvConfigService());
bot.init();
