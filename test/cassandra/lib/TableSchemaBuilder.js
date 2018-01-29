const assert = require('assert');

const TableSchemaBuilder = require('../../../cassandra/lib/TableSchemaBuilder');

describe('Table Schema Builder', () => {
    it('Should build query for table creation with specified fields', () => {
        const tableName = 'my_table';
        const tableSchema = {
            textField: 'text',
            bigIntField: 'bigint',
            floatField: 'float',
            __primaryKey__: [ 'textField', 'bigIntField' ],
            __clusteredKey__: [ 'floatField' ]
        };
        const builder = new TableSchemaBuilder();

        builder.createTable(tableName).fromJSONSchema(tableSchema);

        const query = builder.build();
        assert.equal(query, 'CREATE TABLE my_table(textField text,bigIntField bigint,floatField float,PRIMARY KEY((textField,bigIntField),floatField))');
    });

    it('Should build query without clustered key if it does not specified', () => {
        const tableSchema = {
            textField: 'text',
            bigIntField: 'bigint',
            __primaryKey__: [ 'bigIntField' ]
        };

        const builder = new TableSchemaBuilder();
        builder.createTable('my_table').fromJSONSchema(tableSchema);
        const query = builder.build();

        assert.equal(query, 'CREATE TABLE my_table(textField text,bigIntField bigint,PRIMARY KEY((bigIntField)))');
    });

    it('Should build query without clustered key if it is zero-length property', () => {
        const tableSchema = {
            textField: 'text',
            bigIntField: 'bigint',
            __primaryKey__: [ 'bigIntField' ],
            __clusteredKey__: []
        };

        const builder = new TableSchemaBuilder();
        builder.createTable('my_table').fromJSONSchema(tableSchema);

        const query = builder.build();
        assert.equal(query, 'CREATE TABLE my_table(textField text,bigIntField bigint,PRIMARY KEY((bigIntField)))');
    });

    it('Should build query for table creation with IF NOT EXISTS', () => {
        const tableSchema = {
            col1: 'int',
            __primaryKey__: [ 'col1' ]
        };

        const builder = new TableSchemaBuilder().createTable('my_table').fromJSONSchema(tableSchema).ifNotExists();

        const query = builder.build();
        assert.equal(query, 'CREATE TABLE IF NOT EXISTS my_table(col1 int,PRIMARY KEY((col1)))');
    });

    it('Should build query for table creation with ordering definition', () => {
        const tableSchema = {
            col1: 'int',
            col2: 'int',
            col3: 'int',
            __primaryKey__: [ 'col1' ],
            __clusteredKey__: [ 'col2', 'col3' ],
            __order__: {
                col2: 'ASC',
                col3: 'DESC'
            }
        };

        const builder = new TableSchemaBuilder().createTable('my_table').fromJSONSchema(tableSchema);

        const query = builder.build();
        assert.equal(query, 'CREATE TABLE my_table(col1 int,col2 int,col3 int,PRIMARY KEY((col1),col2,col3)) WITH CLUSTERING ORDER BY(col2 ASC,col3 DESC)');
    });
});