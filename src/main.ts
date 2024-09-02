import { MikroORM } from '@mikro-orm/sqlite';

import {
	Collection,
	Entity,
	Enum,
	ManyToOne,
	OneToMany,
	PrimaryKey,
	PrimaryKeyProp,
	Property,
	Ref
} from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

export enum DocumentType {
	TRAINING_DOCUMENT = 'TRAINING_DOCUMENT',
	FORM = 'FORM',
	GENERATED_RECORD = 'GENERATED_RECORD'
}

@Entity({
	discriminatorColumn: 'type',
	discriminatorMap: {
		[DocumentType.TRAINING_DOCUMENT]: 'TrainingDocument',
		[DocumentType.FORM]: 'Form',
		[DocumentType.GENERATED_RECORD]: 'GeneratedRecord'
	}
})
export abstract class Document {
	@PrimaryKey()
	id: number;

	@Property()
	rawName: string;

	@Enum()
	type: DocumentType;

	@OneToMany(() => DocumentVersion, version => version.document)
	versions = new Collection<DocumentVersion>(this);

	constructor(name: string, type: DocumentType) {
		this.rawName = name;
		this.type = type;
	}
}

@Entity()
export class TrainingDocument extends Document {
	@OneToMany(() => TrainingDocumentVersion, version => version.document)
	versions = new Collection<TrainingDocumentVersion>(this);

	constructor(name: string) {
		super(name, DocumentType.TRAINING_DOCUMENT);
	}
}

@Entity()
export class Form extends Document {
	@OneToMany(() => FormVersion, version => version.document)
	versions = new Collection<FormVersion>(this);

	constructor(name: string) {
		super(name, DocumentType.FORM);
	}
}

@Entity()
export class GeneratedRecord extends Document {
	@OneToMany(() => GeneratedRecordVersion, version => version.document)
	versions = new Collection<GeneratedRecordVersion>(this);

	constructor(name: string) {
		super(name, DocumentType.GENERATED_RECORD);
	}
}

export type DocumentVersionExtraInputs = {
	type: DocumentType;
	versionNumber: number;
};

@Entity({
	discriminatorColumn: 'type',
	discriminatorMap: {
		[DocumentType.TRAINING_DOCUMENT]: 'TrainingDocument',
		[DocumentType.FORM]: 'Form',
		[DocumentType.GENERATED_RECORD]: 'GeneratedRecord'
	}
})
export abstract class DocumentVersion {
	[PrimaryKeyProp]?: ['document', 'versionNumber'];

	@ManyToOne(() => Document, { primary: true })
	document: Ref<Document>;

	@PrimaryKey()
	versionNumber: number;

	@Enum()
	type: DocumentType;

	@OneToMany(() => DocumentVersionReview, review => review.documentVersion)
	reviews = new Collection<DocumentVersionReview>(this);
}

@Entity()
export class TrainingDocumentVersion extends DocumentVersion {}

@Entity()
export class FormVersion extends DocumentVersion {}

@Entity()
export class GeneratedRecordVersion extends DocumentVersion {}

@Entity()
export class DocumentVersionReview {
	@PrimaryKey()
	id: number;

	@ManyToOne()
	documentVersion: Ref<DocumentVersion>;

	@Property()
	approved: boolean;
}

async function main() {
	const orm = await MikroORM.init({
		metadataProvider: TsMorphMetadataProvider,
		dbName: ':memory:',
		entities: [
			Document,
			TrainingDocument,
			Form,
			GeneratedRecord,
			DocumentVersion,
			TrainingDocumentVersion,
			FormVersion,
			GeneratedRecordVersion,
			DocumentVersionReview
		],
		debug: ['query', 'query-params'],
		allowGlobalContext: true // only for testing
	});
	await orm.schema.refreshDatabase();

	const em = orm.em.fork();

	{
		// create a document
		const doc = new TrainingDocument('Training Document');
		await em.persistAndFlush(doc);
		em.clear();
	}

	{
		// get the newest approved version of a document
		const doc = await em.findOneOrFail(Document, { id: 1 });
		const version = await doc.versions
			.loadItems({
				where: { reviews: { $every: { approved: true } } },
				orderBy: { versionNumber: 'DESC' }
			})
			.then(res => (res.length ? res[0] : null));
		console.log(version);
	}
}

main()
	.then(() => process.exit(0))
	.catch(err => {
		console.error(err);
		process.exit(1);
	});
