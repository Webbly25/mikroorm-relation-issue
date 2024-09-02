import { DocumentType } from '../entities/document-type.enum';

export class BaseDocumentVersionCreateInput {
	documentId: number;
	isAuthorUpdate: boolean;

	description: string;
}

export class TrainingDocumentVersionCreateInput extends BaseDocumentVersionCreateInput {}

export class FormVersionCreateInput extends BaseDocumentVersionCreateInput {}

export class GeneratedRecordVersionCreateInput extends BaseDocumentVersionCreateInput {}

export class DocumentVersionCreateInput {
	[DocumentType.TRAINING_DOCUMENT]?: TrainingDocumentVersionCreateInput;
	[DocumentType.FORM]?: FormVersionCreateInput;
	[DocumentType.GENERATED_RECORD]?: GeneratedRecordVersionCreateInput;
}
