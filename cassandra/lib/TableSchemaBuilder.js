const JSONSchema = require('./JSONSchema');
const BaseSchemaBuilder = require('./BaseSchemaBuilder');

class TableSchemaBuilder extends BaseSchemaBuilder {
    /**
     * Specifies type of query
     * @param [tableName = '']
     * @returns {TableSchemaBuilder}
     */
    createTable(tableName = '') {
        return this._create('TABLE', tableName);
    }

    /**
     * Specifies table schema in JSON format
     * @param {object} schemaDescription
     * @returns {TableSchemaBuilder}
     */
    fromJSONSchema(schemaDescription) {
        const jsonSchema = new JSONSchema(schemaDescription);
        const columns = jsonSchema.buildColumnsDefinition();
        const keys = jsonSchema.buildKeys();
        const ordering = jsonSchema.buildOrderDefinition();

        this._definition = `(${columns},${keys}) ${ordering}`.trim();

        return this;
    }
}

module.exports = TableSchemaBuilder;