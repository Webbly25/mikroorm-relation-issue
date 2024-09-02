import { Entity, ManyToOne, PrimaryKey, Property, ref, Ref } from '@mikro-orm/core';
import { DocumentVersion } from './document-version.entity';
import { DocumentVersionReviewInput } from '../inputs/document-version-review.input';

@Entity()
export class DocumentVersionReview {
	@PrimaryKey()
	id: number;

	@ManyToOne()
	documentVersion: Ref<DocumentVersion>;

	@Property()
	reviewedAt = new Date();

	@Property()
	approved: boolean;

	@Property()
	remark?: string;

	constructor(dto: DocumentVersionReviewInput) {
		this.documentVersion = ref(DocumentVersion, [dto.documentId, dto.versionNumber]);
		this.approved = dto.approved;
		if (dto.remark) this.remark = dto.remark;
	}
}
