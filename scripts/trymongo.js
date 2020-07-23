const { MongoClient } = require('mongodb');
// const url = 'mongodb://localhost/issuetracker';

const url = process.env.DB_URL || 'mongodb://localhost/issuetracker';

// The convention in the callback functions is to pass the error as the first argument
// and the result of the operation as the second argument.

function testWithCallbacks(callback) {
  console.log('\n--- testWithCallbacks ---');
  const client = new MongoClient(url, { useNewUrlParser: true });
  // connect() method is an asynchronous method and needs a callback to receive
  // the result of the connection
  //   client.connect(function(err, client) {
  client.connect((connErr) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    // console.log('Connected to MongoDB');
    console.log('Connected to MongoDB URL', url);
    const db = client.db();
    const collection = db.collection('employees');
    const employee = { id: 1, name: 'A. Callback', age: 23 };
    collection.insertOne(employee, (insertErr, result) => {
      if (insertErr) {
        client.close();
        callback(insertErr);
        return;
      }
      console.log('Result of insert:\n', result.insertedId);
      collection.find({ _id: result.insertedId })
        .toArray((findErr, docs) => {
          if (findErr) {
            client.close();
            callback(findErr);
            return;
          }
          console.log('Result of find:\n', docs);
          client.close();
          callback(findErr);
        });
    });
  });
}

async function testWithAsync() {
  console.log('\n--- testWithCallbacks ---');
  const client = new MongoClient(url, { useNewUrlParser: true });
  try {
    // get client object
    await client.connect();
    // console.log('Connected to MongoDB');
    console.log('Connected to MongoDB URL', url);
    // get a connection to the database
    // get a handle to a collection and its methods
    const db = client.db();
    const collection = db.collection('employees');
    const employee = { id: 2, name: 'B. Async', age: 16 };
    const result = await collection.insertOne(employee);
    console.log('Result of insert:\n', result.insertedId);
    const docs = await collection.find({ _id: result.insertedId }).toArray();
    console.log('Result of find:\n', docs);
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

testWithCallbacks((err) => {
  if (err) {
    console.log(err);
  }
  testWithAsync();
});
