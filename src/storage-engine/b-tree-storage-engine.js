const path = require("path");
const fs = require("fs");

class BTreeStorageEngine {
  constructor(dataPath) {
    this.dataPath = dataPath || path.join(__dirname, "../../data");

    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath);
    }
  }

  createTable(tableName, schema) {
    const tablePath = path.join(this.dataPath, tableName);

    if (fs.existsSync(tablePath)) {
      throw new Error(`${tableName} already exists`);
    }

    fs.mkdirSync(tablePath);

    // Save Avro schema to the table directory
    const schemaFilePath = path.join(tablePath, "schema.avsc");
    fs.writeFileSync(schemaFilePath, JSON.stringify(schema), "utf-8");

    // Initialize the heap file and the slotted index file
    const heapFilePath = path.join(tablePath, "heap.dat");
    fs.writeFileSync(heapFilePath, ""); // empty heap file

    const slottedIndexPath = path.join(tablePath, "slotted-index.json");
    fs.writeFileSync(slottedIndexPath, JSON.stringify([])); // empty index file
  }
}

module.exports = BTreeStorageEngine;
