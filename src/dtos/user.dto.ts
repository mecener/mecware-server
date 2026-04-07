export class UserDto {
	email;
	username;
	id;
	isActivated;
	avatar;

	constructor(model: { email: string; username: string; id: number; isActivated: boolean; avatar: string }) {
		this.email = model.email;
		this.username = model.username;
		this.id = model.id;
		this.isActivated = model.isActivated;
		this.avatar = model.avatar;
	}
}
