export class UserDto {
	email;
	username;
	id;
	isActivated;

	constructor(model: { email: string; username: string; id: number; isActivated: boolean }) {
		this.email = model.email;
		this.username = model.username;
		this.id = model.id;
		this.isActivated = model.isActivated;
	}
}
