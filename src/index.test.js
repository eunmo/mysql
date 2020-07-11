const { dml, query, cleanup } = require('.');

beforeAll(async () => {
  await dml('DROP TABLE IF EXISTS dummy_tbl;');
  await dml('CREATE TABLE dummy_tbl(c1 int, c2 varchar(255));');
});

afterAll(async () => {
  await dml('DROP TABLE IF EXISTS dummy_tbl;');
  await cleanup();
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE dummy_tbl;');
});

test('can query', async () => {
  const rows = await query('SELECT * from dummy_tbl');
  expect(rows.length).toBe(0);
});

test('can insert', async () => {
  await dml('INSERT INTO dummy_tbl VALUES (1, "a"), (2, "b");');
  const rows = await query('SELECT * from dummy_tbl');
  expect(rows.length).toBe(2);
});
