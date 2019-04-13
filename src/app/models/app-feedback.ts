export class AppFeedback {
	customerId: string;
	email: string;
	message: string;

	public constructor(init?: Partial<AppFeedback>) {
	  Object.assign(this, init);
	}
	
}