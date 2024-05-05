import { IEnvConfig } from '../../config/env.config.interface';
import { EnvConfig } from '../../config/env.config.service';
import { IInstagramPage } from './instagram.page.interface';
import { Browser, Page } from 'puppeteer';
import { SelfDelete, SetDeleteTimeout } from './page.selfdelete.decorator';

@SelfDelete
export class InstagramPage implements IInstagramPage {
	userId: string;
	browser: Browser;
	instagramName: string;
	userPageURL: string;
	loginURL: string;
	errorSvg: string;
	usernameInput: string;
	passwordInput: string;
	submitButton: string;
	profilePicture: string;
	noProfilePicture: string;
	saveInfoButton: string;
	turnOffNotificationsButton: string;
	page!: Page;
	envConfigService: IEnvConfig;
	imgURLs: Set<string>;

	constructor(userId: string, browser: Browser) {
		this.userId = userId;
		this.browser = browser;
		this.instagramName = '';
		this.userPageURL = '';
		this.loginURL = 'https://www.instagram.com/accounts/login/';
		this.errorSvg = 'svg[aria-label="Error"]';
		this.usernameInput = 'input[name="username"]';
		this.passwordInput = 'input[name="password"]';
		this.submitButton = 'button[type="submit"]';
		this.profilePicture = '';
		this.noProfilePicture = 'img[alt="Add a profile photo"]';
		this.saveInfoButton = 'button[class=" _acan _acap _acas _aj1- _ap30"]';
		this.turnOffNotificationsButton = 'button[class="_a9-- _ap36 _a9_1"]';
		this.envConfigService = EnvConfig.getInstance();
		this.imgURLs = new Set();
	}

	@SetDeleteTimeout()
	async getImgURLs(instagramName: string): Promise<string[]> {
		await this.setUpPage(instagramName);

		// find imges
		return Array.from(this.imgURLs);
	}

	async setUpPage(instagramName: string) {
		this.setInstagramUser(instagramName);
		await this.loadUserPage();
	}

	setInstagramUser(instagramName: string): void {
		this.instagramName = instagramName;
		this.userPageURL = `https://www.instagram.com/${this.instagramName}`;
		this.profilePicture = `img[alt="${this.instagramName}'s profile picture"]`;
	}

	async getPage() {
		if (this.page) return;
		this.page = await this.browser.newPage();
		await this.page.setViewport({ width: 800, height: 600 });
		return;
	}

	private async logIn(): Promise<void> {
		if (!(await this.checkIfItsErrorScreen())) return;
		await this.loadPage(`${this.loginURL}`);
		const [usernameInput, passwordInput] = await Promise.all([
			this.page.waitForSelector(this.usernameInput),
			this.page.waitForSelector(this.passwordInput),
		]);
		if (!usernameInput || !passwordInput) throw new Error("Failed to login. Can't find login and password inputs.");
		await usernameInput.type(this.envConfigService.get('INSTAGRAM_LOGIN'));
		await passwordInput.type(this.envConfigService.get('INSTAGRAM_PASSWORD'));
		await this.page.click(this.submitButton);
		await this.clickButton(this.saveInfoButton);
		await this.clickButton(this.turnOffNotificationsButton);
		if (await this.checkIfItsErrorScreen()) throw new Error('Failed to login.');
	}

	private async clickButton(selector: string): Promise<void> {
		try {
			const button = await this.page.waitForSelector(selector, { timeout: 3000 });
			if (button) this.page.click(selector);
		} catch (err) {
			return;
		}
	}

	private async loadPage(URL: string): Promise<void> {
		await this.getPage();
		await this.page.goto(URL);
	}

	private async loadUserPage(): Promise<void> {
		await this.loadPage(`${this.userPageURL}`);
		await this.logIn();
		if (this.page.url() !== this.userPageURL) await this.loadPage(`${this.userPageURL}`);
		if (!this.checkIfItsUserPage()) throw new Error('Failed to load user page');
	}

	private async checkIfItsErrorScreen(): Promise<boolean> {
		try {
			await this.page.waitForSelector(this.errorSvg, { timeout: 3000 });
			return true;
		} catch (err) {
			return false;
		}
	}

	private async checkIfItsUserPage(): Promise<boolean> {
		const profilePicture = new Promise((resolve, reject) => {
			resolve(this.page.waitForSelector(this.profilePicture, { timeout: 3000 }));
		});
		const noProfilePicture = new Promise((resolve, reject) => {
			resolve(this.page.waitForSelector(this.noProfilePicture, { timeout: 3000 }));
		});
		const result = await Promise.race([profilePicture, noProfilePicture]);
		if (result) return true;
		return false;
	}

	async closePage(): Promise<void> {
		this.page.close();
	}
}
