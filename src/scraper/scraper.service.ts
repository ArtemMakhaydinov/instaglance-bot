import puppeteer, { Browser } from 'puppeteer';
import { IScraper, IScraperStatic } from './scraper.interface';
import { IInstagramPage } from './page/instagram.page.interface';
import { InstagramPage } from './page/instagram.page.service';
import { IEnvConfig } from '../config/env.config.interface';
import { EnvConfig } from '../config/env.config.service';

export class InstagramScraper implements IScraper {
	private browser!: Browser;
	static instance: InstanceType<IScraperStatic>;
	private browserWSEndpoint!: string;
	private envConfigService!: IEnvConfig;
	private pages!: Map<string, IInstagramPage>;

	constructor() {
		if (InstagramScraper.instance) return InstagramScraper.instance;
		this.envConfigService = EnvConfig.getInstance();
		this.pages = new Map();
	}

	async init() {
		const page = await this.getPage('instaglance');
		await page.setUpPage(this.envConfigService.get('INSTAGRAM_LOGIN'));
	}

	static getInstance() {
		if (!this.instance) this.instance = new InstagramScraper();
		return this.instance;
	}

	async getImgURLs(userId: string, instagramName: string): Promise<string[]> {
		const page = await this.getPage(userId);
		return await page.getImgURLs(instagramName);
	}

	private async getBrowser() {
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
		const page = new InstagramPage(userId, browser);
		this.pages.set(userId, page);
		return page;
	}

	async closeAndDeletePage(userId: string): Promise<void> {
		const page = this.pages.get(userId);
		page?.closePage();
		this.pages.delete(userId);
	}
}
