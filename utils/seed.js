const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomName, getRandomAssignments } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  await Thought.deleteMany({});

  await User.deleteMany({});

  const users = [];

  for (let i = 0; i < 20; i++) {

    const thoughts = getThoughts(20);

    const username = getRandomName();
    const email = []
    const thoughts = []
    const friends = getRandomName();

    users.push({
      username,
      email,
      thoughts,
      friends,
    });
  }

  await User.collection.insertMany(friends);

  await User.collection.insertOne({
    friendName: 'John Doe',
    users: [...users],
  });

  console.table(users);
  console.info('Seeding complete');
  process.exit(0);
});
