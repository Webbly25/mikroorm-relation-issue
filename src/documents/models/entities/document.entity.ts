import { Collection, Entity, Enum, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import {
	BaseDocumentCreateInput,
	FormCreateInput,
	GeneratedRecordCreateInput,
	TrainingDocumentCreateInput
} from '../inputs/document-create.input';
import { DocumentType } from './document-type.enum';
import {
	DocumentVersion,
	FormVersion,
	GeneratedRecordVersion,
	TrainingDocumentVersion
} from './document-version.entity';

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

	// ...

	@Enum()
	type: DocumentType;

	@OneToMany(() => DocumentVersion, version => version.document)
	versions = new Collection<DocumentVersion>(this);

	constructor(type: DocumentType, dto: BaseDocumentCreateInput) {
		this.rawName = dto.name;
		this.type = type;
	}
}

@Entity()
export class TrainingDocument extends Document {
	@OneToMany(() => TrainingDocumentVersion, version => version.document)
	versions = new Collection<TrainingDocumentVersion>(this);

	constructor(dto: TrainingDocumentCreateInput) {
		super(DocumentType.TRAINING_DOCUMENT, dto);
	}
}

@Entity()
export class Form extends Document {
	@OneToMany(() => FormVersion, version => version.document)
	versions = new Collection<FormVersion>(this);

	constructor(dto: FormCreateInput) {
		super(DocumentType.FORM, dto);
	}
}

@Entity()
export class GeneratedRecord extends Document {
	@OneToMany(() => GeneratedRecordVersion, version => version.document)
	versions = new Collection<GeneratedRecordVersion>(this);

	constructor(dto: GeneratedRecordCreateInput) {
		super(DocumentType.GENERATED_RECORD, dto);
	}
}
