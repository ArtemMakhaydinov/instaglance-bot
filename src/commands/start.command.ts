import { Bot } from 'grammy';
import { Command } from './command.class';

export class StartCommand extends Command {
	constructor(bot: Bot) {
		super(bot);
	}

	handle(): void {
		this.bot.command('start', (ctx) => {
			ctx.reply('Welcome!');
		});
	}
}
