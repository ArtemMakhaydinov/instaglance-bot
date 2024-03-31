import puppeteer, { Browser } from 'puppeteer';
import { IScraper, IScraperStatic } from './scraper.interface';
import { IInstagramPage } from './browser/instagram.page.interface';
import { InstagramPage } from './browser/instagram.page.service';

export class InstagramScraper implements IScraper {
	private browser!: Browser;
	static instance: InstanceType<IScraperStatic>;
	private browserWSEndpoint!: string;
	private pages: Map<string, IInstagramPage>;

	constructor() {
		this.pages = new Map();
		if (InstagramScraper.instance) return InstagramScraper.instance;
	}

	static getInstance() {
		if (!this.instance) this.instance = new InstagramScraper();
		return this.instance;
	}

	async getImgURLs(login: string): Promise<string[]> {
		throw new Error('Method not implemented.');
	}

	async getBrowser() {
		if (this.browser?.connected) return this.browser;
		if (this.browserWSEndpoint) {
			this.browser = await puppeteer.connect({ browserWSEndpoint: this.browserWSEndpoint });
		} else {
			this.browser = await puppeteer.launch({
				headless: false,
				args: ['--no-sandbox', '--single-process', '--no-zygote', '--disable-dev-shm-usage'],
			});

			this.browserWSEndpoint = this.browser.wsEndpoint();
		}

		if (!this.browser.connected) throw new Error('Failed to launch browser');
		return this.browser;
	}

	private async getPage(userId: string): Promise<IInstagramPage> {
		const browser = await this.getBrowser();
		if (this.pages.has(userId)) return this.pages.get(userId)!;
		const page = new InstagramPage(browser, userId);
		this.pages.set(userId, page);
		return page;
	}
}
