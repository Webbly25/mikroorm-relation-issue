import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { DocumentSeeder } from './DocumentSeeder';

export class DatabaseSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {
		// needed for postgres
		// await em.getConnection().execute("SET session_replication_role = 'replica';");

		try {
			await this.call(em, [DocumentSeeder], context);
		} finally {
			// needed for postgres
			// await em.getConnection().execute("SET session_replication_role = 'origin';");
		}
	}
}
