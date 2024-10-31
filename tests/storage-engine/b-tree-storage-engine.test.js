const fs = require("fs");
const path = require("path");
const BTreeStorageEngine = require("../../src/storage-engine/b-tree-storage-engine");

describe("BTreeStorageEngine constructor", () => {
  console.log("Inside first describe block");
  const tempDataPath = path.join(__dirname, "temp_data");

  afterEach(() => {
    // Clean up by removing the temp_data folder if it exists
    if (fs.existsSync(tempDataPath)) {
      fs.rmSync(tempDataPath, { recursive: true });
    }
  });

  it("should create the data directory if it does not exist", () => {
    // Arrange - Ensure the temp directory doesn't exist before the test
    if (fs.existsSync(tempDataPath)) {
      fs.rmSync(tempDataPath, { recursive: true });
    }

    // Act - Instantiate the BTreeStorageEngine with the temporary path
    new BTreeStorageEngine(tempDataPath);

    // Assert - Verify the directory is created
    expect(fs.existsSync(tempDataPath)).toBe(true);
  });

  it("should not create the data directory if it already exists", () => {
    // Arrange - Manually create the directory
    fs.mkdirSync(tempDataPath);

    // Act - Instantiate the BTreeStorageEngine with the temporary path
    new BTreeStorageEngine(tempDataPath);

    // Assert - Verify the directory still exists
    expect(fs.existsSync(tempDataPath)).toBe(true);
  });
});

describe("BTreeStorageEngine createTable", () => {
  console.log("Inside second describe block");

  const tempDataPath = path.join(__dirname, "temp_data");
  const tableName = "names";
  const validSchema = {
    type: "record",
    name: "NameRecord",
    fields: [
      { name: "id", type: "int" },
      { name: "name", type: "string" },
    ],
  };

  let storageEngine;

  beforeEach(() => {
    storageEngine = new BTreeStorageEngine(tempDataPath);
  });

  afterEach(() => {
    // Clean up by removing the temp_data folder if it exists
    if (fs.existsSync(tempDataPath)) {
      fs.rmSync(tempDataPath, { recursive: true });
    }
  });

  it(`should create a schema file for a valid table`, () => {
    // Act
    storageEngine.createTable(tableName, validSchema);

    /* Assert */

    // Verify that the schema file was created
    const schemaFilePath = path.join(tempDataPath, `${tableName}/schema.avsc`);
    expect(fs.existsSync(schemaFilePath)).toBe(true);

    // Verify that the file content matches the schema
    const fileContent = fs.readFileSync(schemaFilePath, "utf-8");
    expect(fileContent).toEqual(JSON.stringify(validSchema));

    // Verify that the empty heap file and slotted index file are created
    const heapFilePath = path.join(tempDataPath, `${tableName}/heap.dat`);
    const slottedIndexPath = path.join(
      tempDataPath,
      `${tableName}/slotted-index.json`
    );

    expect(fs.existsSync(heapFilePath)).toBe(true);
    expect(fs.existsSync(slottedIndexPath)).toBe(true);
  });
});
