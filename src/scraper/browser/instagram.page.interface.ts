export interface IInstagramPage {
	getImgURLs(): Promise<Set<string>>;
}
