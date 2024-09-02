import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import {
	Document,
	Form,
	GeneratedRecord,
	TrainingDocument
} from '../documents/models/entities/document.entity';

export class DocumentSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		const documents: Document[] = [
			new TrainingDocument({ name: 'Training document' }),
			new Form({ name: 'Form' }),
			new GeneratedRecord({ name: 'Generated Record' })
		];

		await em.persistAndFlush(documents);
	}
}
