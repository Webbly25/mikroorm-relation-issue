import { DocumentType } from '../entities/document-type.enum';

export class BaseDocumentCreateInput {
	name: string;
}

export class TrainingDocumentCreateInput extends BaseDocumentCreateInput {}

export class FormCreateInput extends BaseDocumentCreateInput {}

export class GeneratedRecordCreateInput extends BaseDocumentCreateInput {}

export class DocumentCreateInput {
	[DocumentType.TRAINING_DOCUMENT]?: TrainingDocumentCreateInput;
	[DocumentType.FORM]?: FormCreateInput;
	[DocumentType.GENERATED_RECORD]?: GeneratedRecordCreateInput;
}
