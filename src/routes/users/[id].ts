import type { User } from '$lib/database/models';
import { getUser, updateUser, deleteUser } from '$lib/database/users';

/** @type {import('./users/[id]').RequestHandler} */
export async function get({ params }: { params: { id: string } }) {
	try {
		const user = await getUser({ id: parseInt(params.id) });

		return {
			body: { user: user }
		};
	} catch (error) {
		console.error(error);
		return {
			status: 500,
			body: {
				error: {
					message: 'Internal Server Error'
				}
			}
		};
	}
}

/** @type {import('./users/[id]').RequestHandler} */
export async function put({ request, params }: { request: Request; params: { id: string } }) {
	try {
		const formData = await request.formData();

		let data = {};
		formData.forEach((v, k) => {
			data[k] = v.valueOf();
		});

		let user: Partial<User> & Pick<User, 'id'> = {
			id: parseInt(params.id),
			...data
		};

		user = await updateUser(user);

		// redirect to the newly created user
		return {
			status: 303,
			headers: {
				location: `/users/${user.id}`
			}
		};
	} catch (error) {
		console.error(error);
		return {
			status: 500,
			body: {
				error: {
					message: 'Internal Server Error'
				}
			}
		};
	}
}

/** @type {import('./users/[id]').RequestHandler} */
export async function del({ params }: { params: { id: string } }) {
	try {
		await deleteUser(parseInt(params.id));

		// redirect to the newly created user
		return {
			status: 303,
			headers: {
				location: `/`
			}
		};
	} catch (error) {
		console.error(error);
		return {
			status: 500,
			body: {
				error: {
					message: 'Internal Server Error'
				}
			}
		};
	}
}
