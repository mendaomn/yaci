const { create, getByName, list } = require('../db')

const setup = () => {
  const db = create()
  db.flush()
  return db
}

test('should allow to store objects with unique ids', () => {
  const db = setup()

  const object = {a: 1, b: 2}
  const storedObject = db.store(object)

  expect(storedObject).toMatchObject(object)
  expect(storedObject).toHaveProperty('_id')

  const retrievedObject = db.find(storedObject._id)

  expect(retrievedObject).toEqual(storedObject)
});

test('should allow to find object by id', () => {
  const db = setup()

  const object = {a: 1, b: 2}
  const storedObject = db.store(object)
  const retrievedObject = db.find(storedObject._id)

  expect(retrievedObject).toEqual(storedObject)
});

test('should allow to get all objects in the database', () => {
  const db = setup()

  const storedObject1 = db.store({a: 1, b: 2})
  const storedObject2 = db.store({c: 1, d: '2'})
  const storedObject3 = db.store({e: 1, f: '_'})
  
  const allObjects = db.getAll()

  expect(allObjects).toEqual([
    storedObject1,
    storedObject2,
    storedObject3
  ])
});

test('should allow to create many isolated dbs', () => {
  const db1 = create('one')
  const db2 = create('two')

  const object1 = db1.store({data: 'can only be in db1'})
  const object2 = db2.store({data: 'can only be in db2'})

  expect(db1.getAll()).toEqual([object1])
  expect(db2.getAll()).toEqual([object2])
});

test('should allow to get db by name', () => {
  const db1 = create('one')
  const db2 = create('two')

  const object1 = getByName('one')
  const object2 = getByName('two')

  expect(object1).toBe(db1)
  expect(object2).toBe(db2)
});

test('should allow to list dbs', () => {
  const db1 = create('one')
  const db2 = create('two')

  const dbList = list()

  expect(dbList).toMatchObject({
    one: db1,
    two: db2
  })
});