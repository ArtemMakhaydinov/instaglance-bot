import { Bot } from 'grammy';
import { Command } from './command.class';
import { InstagramScraper } from '../scraper/scraper.service';

export class StartCommand extends Command {
	constructor(bot: Bot) {
		super(bot);
	}

	handle(): void {
		this.bot.command('start', async (ctx) => {
			const scraper = InstagramScraper.getInstance();
			await scraper.getImgURLs(ctx.update.message?.from, ctx.update.message?.text);
			ctx.reply('Welcome!123');
		});
	}
}
