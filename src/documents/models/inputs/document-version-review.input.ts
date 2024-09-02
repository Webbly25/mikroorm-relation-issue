export class DocumentVersionReviewInput {
	documentId: number;

	versionNumber: number;

	approved: boolean;

	remark?: string | null;
}
