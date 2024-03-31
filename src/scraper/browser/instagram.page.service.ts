import { IEnvConfig } from '../../config/env.config.interface';
import { EnvConfig } from '../../config/env.config.service';
import { IInstagramPage } from './instagram.page.interface';
import { Browser, Page } from 'puppeteer';

export class InstagramPage implements IInstagramPage {
	browser: Browser;
	userId: string;
	homeURL: string;
	errorSvg: string;
	usernameInput: string;
	passwordInput: string;
	submitButton: string;
	page!: Page;
	envConfigService: IEnvConfig;
	imgURLs: Set<string>;

	constructor(browser: Browser, userId: string) {
		this.browser = browser;
		this.userId = userId;
		this.homeURL = 'https://www.instagram.com/';
		this.errorSvg = 'svg[aria-label="Error"]';
		this.usernameInput = 'input[name="username"]';
		this.passwordInput = 'input[name="password"]';
		this.submitButton = 'button[type="submit"]';
		this.envConfigService = EnvConfig.getInstance();
		this.imgURLs = new Set();
		this.getImgURLs();
	}

	async getImgURLs(): Promise<Set<string>> {
		await this.createPage();
		//go to URL + login
		await this.logIn();
		// find imges
		return this.imgURLs;
	}

	async createPage() {
		if (this.page) return;
		this.page = await this.browser.newPage();
		await this.page.setViewport({ width: 800, height: 600 });
		return;
	}

	async logIn(): Promise<void> {
		if (!(await this.checkIfLoggedIn())) return;
		// go to login page
		const usernameInput = await this.page.$(this.usernameInput);
		const passwordInput = await this.page.$(this.passwordInput);
		if (usernameInput && passwordInput) {
			await usernameInput.type(this.envConfigService.get('INSTAGRAM_LOGIN'));
			await passwordInput.type(this.envConfigService.get('INSTAGRAM_PASSWORD'));
			await this.page.click(this.submitButton);
			// wait for idle
			if (!(await this.checkIfLoggedIn())) throw new Error('Failed to login.');
		} else {
			throw new Error('Failed to login.');
		}
	}

	async checkIfLoggedIn(): Promise<boolean> {
		const errorSvg = await this.page.$(this.errorSvg);
		if (errorSvg) return false;
		return true;
	}
}
