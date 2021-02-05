const { dml, insertMultiple, query, queryOne, cleanup } = require('.');

beforeAll(async () => {
  await dml('DROP TABLE IF EXISTS dummy_tbl');
  await dml('CREATE TABLE dummy_tbl(c1 int, c2 varchar(255))');
});

afterAll(async () => {
  await dml('DROP TABLE IF EXISTS dummy_tbl');
  await cleanup();
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE dummy_tbl');
});

test('can query', async () => {
  const rows = await query('SELECT * from dummy_tbl');
  expect(rows.length).toBe(0);
});

test('can insert', async () => {
  await dml('INSERT INTO dummy_tbl VALUES (1, "a"), (2, "b")');
  const rows = await query('SELECT * from dummy_tbl');
  expect(rows.length).toBe(2);
});

test('can insert multiple values', async () => {
  const values = [
    [1, 'a'],
    [2, 'b'],
  ];
  await insertMultiple('INSERT INTO dummy_tbl VALUES ?', values);
  const rows = await query('SELECT * from dummy_tbl');
  expect(rows.length).toBe(2);
});

test('can query one', async () => {
  await dml('INSERT INTO dummy_tbl VALUES (1, "a"), (2, "b")');
  const row = await queryOne('SELECT * from dummy_tbl WHERE c1 = ?', 1);
  expect(row).toEqual({ c1: 1, c2: 'a' });
});
