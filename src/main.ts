import { MikroORM } from '@mikro-orm/sqlite';
import { Document } from './documents/models/entities/document.entity';

async function main() {
	const orm = await MikroORM.init();
	const em = orm.em.fork();
	const documentRepo = em.getRepository(Document);

	// get all documents
	// const docs = await documentRepo.findAll();
	// console.log(docs);

	// get the newest approved version of a document
	const doc = await documentRepo.findOneOrFail({ id: 1 });
	const version = await doc.versions
		.loadItems({
			where: { reviews: { $every: { approved: true } } },
			orderBy: { versionNumber: 'DESC' }
		})
		.then(res => (res.length ? res[0] : null));
	console.log(version);
}

main()
	.then(() => process.exit(0))
	.catch(err => {
		console.error(err);
		process.exit(1);
	});
