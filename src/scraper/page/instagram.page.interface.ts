export interface IInstagramPage {
	getImgURLs(instagramName: string): Promise<string[]>;
	setUpPage(instagramName: string): Promise<void>;
	closePage(): void;
}
