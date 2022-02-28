import { db } from './client';

export class Jurisdiction {
	abbreviation: string;
	name: string;
}

export async function listJurisdictions(): Promise<Jurisdiction[]> {
	return await db.withSchema('emporium').table<Jurisdiction>('jurisdictions').select();
}
