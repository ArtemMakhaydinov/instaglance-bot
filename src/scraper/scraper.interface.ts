export interface IScraperStatic {
	instance: InstanceType<this> | null;
	new (...args: any[]): any;
	getInstance(URL: string): InstanceType<this>;
}

export interface IScraper {
	getImgURLs(userId: string, login: string): Promise<string[]>;
	closeAndDeletePage(userId: string): void;
}
