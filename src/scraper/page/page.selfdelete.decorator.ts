import { clearTimeout } from 'timers';
import { IScraper } from '../scraper.interface';
import { InstagramScraper } from '../scraper.service';
import { InstagramPage } from './instagram.page.service';

export function SelfDelete(target: typeof InstagramPage) {
	return class extends target {
		scraper: IScraper = InstagramScraper.getInstance();
		deleteTimer: number = 900000;
		deleteTimeout: ReturnType<typeof setTimeout> | null = this.setDeleteTimeout();

		setDeleteTimeout() {
			const timeout = setTimeout(
				(userId) => {
					this.closePage();
					this.scraper.closeAndDeletePage(userId);
				},
				90000,
				this.userId
			);

			if (this.deleteTimeout) clearTimeout(this.deleteTimeout);
			return (this.deleteTimeout = timeout);
		}
	};
}

export function SetDeleteTimeout() {
	return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
		const originalMethod = descriptor.value;
		descriptor.value = function (this: any, ...args: any[]): any {
			this.setDeleteTimeout();
			return originalMethod.apply(this, args);
		};
		return descriptor;
	};
}
