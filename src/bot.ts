import { Command } from './commands/command.class';
import { StartCommand } from './commands/start.command';
import { IEnvConfig } from './config/env.config.interface';
import { Bot, BotConfig } from 'grammy';
import { EnvConfig } from './config/env.config.service';
import { IBotContext } from './context/context.interface';
import { InstagramScraper } from './scraper/scraper.service';

export class InstaglanceBot {
	private bot: Bot<IBotContext>;
	commands: Command[] = [];
	envConfigService: IEnvConfig;

	constructor(private readonly botConfig?: BotConfig<IBotContext>) {
		this.envConfigService = EnvConfig.getInstance();
		this.bot = new Bot<IBotContext>(this.envConfigService.get('TOKEN'), botConfig);
		this.init();
	}

	async init() {
		const scraper = new InstagramScraper();
		await scraper.init();
		console.log('Bot init complete');

		this.commands = [new StartCommand(this.bot)];
		for (const command of this.commands) {
			command.handle();
		}

		this.bot.start();
	}
}
