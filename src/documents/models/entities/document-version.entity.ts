import {
	Collection,
	Entity,
	Enum,
	ManyToOne,
	OneToMany,
	PrimaryKey,
	PrimaryKeyProp,
	Property,
	Ref,
	ref
} from '@mikro-orm/core';
import {
	BaseDocumentVersionCreateInput,
	FormVersionCreateInput,
	GeneratedRecordVersionCreateInput,
	TrainingDocumentVersionCreateInput
} from '../inputs/document-version-create.input';
import { DocumentVersionReview } from './document-review.entity';
import { DocumentType } from './document-type.enum';
import { Document } from './document.entity';

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

	@Property()
	description: string;

	@OneToMany(() => DocumentVersionReview, review => review.documentVersion)
	reviews = new Collection<DocumentVersionReview>(this);

	constructor(extra: DocumentVersionExtraInputs, dto: BaseDocumentVersionCreateInput) {
		this.document = ref(Document, dto.documentId);
		this.versionNumber = extra.versionNumber;

		this.type = extra.type;
		this.description = dto.description;
	}
}

@Entity()
export class TrainingDocumentVersion extends DocumentVersion {
	constructor(
		extra: Omit<DocumentVersionExtraInputs, 'type'>,
		dto: TrainingDocumentVersionCreateInput
	) {
		super({ ...extra, type: DocumentType.TRAINING_DOCUMENT }, dto);
	}
}

@Entity()
export class FormVersion extends DocumentVersion {
	constructor(extra: Omit<DocumentVersionExtraInputs, 'type'>, dto: FormVersionCreateInput) {
		super({ ...extra, type: DocumentType.FORM }, dto);
	}
}

@Entity()
export class GeneratedRecordVersion extends DocumentVersion {
	constructor(
		extra: Omit<DocumentVersionExtraInputs, 'type'>,
		dto: GeneratedRecordVersionCreateInput
	) {
		super({ ...extra, type: DocumentType.GENERATED_RECORD }, dto);
	}
}
