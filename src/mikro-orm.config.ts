import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Options, SqliteDriver } from '@mikro-orm/sqlite';

const config: Options = {
	metadataProvider: TsMorphMetadataProvider,
	entities: ['./dist/**/*.entity.js'],
	entitiesTs: ['./src/**/*.entity.ts'],

	driver: SqliteDriver,
	dbName: 'sqlite.db',

	debug: true
};

export default config;
