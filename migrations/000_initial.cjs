const schema = 'plates';

exports.up = async function (knex) {
	await knex.schema.createSchema(schema);
	await knex.schema.withSchema(schema).createTable('jurisdictions', function (table) {
		table.string('abbreviation', 2).primary();
		table.string('name').notNullable();
	});

	await knex.schema.withSchema(schema).createTable('plates', function (table) {
		table.increments();

		table.string('jurisdiction').notNullable();
		table
			.foreign('jurisdiction')
			.references('abbreviation')
			.inTable(schema + '.jurisdictions');

		table.integer('startYear');
		table.integer('endYear');
	});

	await knex.schema.withSchema(schema).createTable('users', function (table) {
		table.increments();
		table.string('email').notNullable();
		table.string('serial').notNullable(7);
		table.boolean('isAdmin').notNullable().default(false);

		table.unique(['email']);
		table.unique(['serial']);

		table.check('upper(??) = ??', ['serial', 'serial']);
	});

	await knex.schema.withSchema(schema).createTable('images', function (table) {
		table.increments();

		table.integer('plateId').notNullable();
		table
			.foreign('plateId')
			.references('id')
			.inTable(schema + '.plates');

		table.string('url');
	});

	await knex.schema.withSchema(schema).createTable('scores', function (table) {
		table.integer('plateId').notNullable();
		table
			.foreign('plateId')
			.references('id')
			.inTable(schema + '.plates');

		table.integer('userId').notNullable();
		table
			.foreign('userId')
			.references('id')
			.inTable(schema + '.users');

		table.enum('category', [
			'overall',
			'identifiability',
			'colors',
			'symbols',
			'typeface',
			'clarity'
		]);

		table.primary(['plateId', 'userId', 'category']);

		table.integer('value').checkBetween([0, 10]);
		table.string('explanation');
	});
};

exports.down = async function (knex) {
	await knex.schema.withSchema(schema).dropTable('scores');
	await knex.schema.withSchema(schema).dropTable('images');
	await knex.schema.withSchema(schema).dropTable('users');
	await knex.schema.withSchema(schema).dropTable('plates');
	await knex.schema.withSchema(schema).dropTable('jurisdictions');

	await knex.schema.dropSchema(schema);
};
