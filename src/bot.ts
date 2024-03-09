import { Command } from './commands/command.class';
import { StartCommand } from './commands/start.command';
import { IEnvConfigService } from './config/env.config.interface';
import { Bot, BotConfig } from 'grammy';
import { EnvConfigService } from './config/env.config.service';
import { IBotContext } from './context/context.interface';

export class InstaglanceBot {
	private bot: Bot<IBotContext>;
	commands: Command[] = [];

	constructor(
		private readonly envConfigService: IEnvConfigService,
		private readonly botConfig?: BotConfig<IBotContext>
	) {
		this.bot = new Bot<IBotContext>(
			this.envConfigService.get('TOKEN'),
			botConfig
		);
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
