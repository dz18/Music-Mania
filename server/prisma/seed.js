const { faker } = require('@faker-js/faker');
const prisma = require('./client');
const bcrypt = require('bcrypt');

const ratingOptions = [0.5,1,1.5,2,2.5,3,3.5,4,4.5,5];

const artistIDs = [
  "6925db17-f35e-42f3-a4eb-84ee6bf5d4b0",
  "2baf3276-ed6a-4349-8d2e-f4601e7b2167",
  "0e24f776-4158-4934-8b78-b4b1edb3ad62"
];

async function createUsers() {
  const userlist = [];

  // Create TEST Admin User
  const hashedPassword = await bcrypt.hash(process.env.PASSWORD, 10);
  userlist.push({
    username: process.env.USERNAME,
    email: process.env.EMAIL,
    password: hashedPassword,
    phoneNumber: faker.phone.number(),
    aboutMe: faker.lorem.sentences(3),
    age: faker.number.int({ min: 18, max: 60 })
  });

  // Create 100 random users
  for (let i = 0; i < 100; i++) {
    userlist.push({
      email: faker.internet.email(),
      username: faker.internet.username(),
      password: await bcrypt.hash(faker.internet.password(), 10),
      phoneNumber: faker.phone.number(),
      aboutMe: faker.lorem.sentences(Math.floor(Math.random() * 6)),
      age: faker.number.int({ min: 18, max: 60 })
    });
  }

  await prisma.user.createMany({
    data: userlist,
    skipDuplicates: true
  });

  return userlist; // return users to reuse in other seeds
}

async function createArtists() {
  const artists = [
    { id: artistIDs[0], name: 'Olivia Rodrigo' },
    { id: artistIDs[1], name: 'Playboi Carti' },
    { id: artistIDs[2], name: 'LSD and The Search For God' },
  ];

  await Promise.all(
    artists.map(artist => prisma.artist.create({ data: artist }))
  );
}

async function createArtistReviews() {
  const users = await prisma.user.findMany()

  const reviews = []

  for (const user of users) {
    for (const artistId of artistIDs) {
      reviews.push(
        prisma.userArtistReviews.create({
          data: {
            userId: user.id,          // ✅ NOW EXISTS
            artistId,
            rating: faker.helpers.arrayElement(ratingOptions),
            title: faker.datatype.boolean() ? faker.lorem.sentence() : null,
            review: faker.datatype.boolean() ? faker.lorem.paragraph() : null,
            status: "PUBLISHED",
          },
        })
      )
    }
  }

  await Promise.all(reviews)
}

async function createFollows(users) {
  const follow = [];

  for (let user of users) {
    const count = Math.floor(Math.random() * (users.length - 1)) + 1;
    const shuffled = [...users].sort(() => Math.random() - 0.5);
    const followList = shuffled.slice(0, count);

    for (let f of followList) {
      if (user.id === f.id) continue;

      follow.push({
        followerId: user.id,
        followingId: f.id
      });
    }
  }

  await prisma.follow.createMany({
    data: follow,
    skipDuplicates: true
  });
}

async function createArtistLikes() {
  const users = await prisma.user.findMany({
    select: { id: true }
  })

  if (!users.length) {
    throw new Error("No users found — cannot create artist likes")
  }

  const artistLikes = []

  for (const user of users) {
    const count = faker.number.int({ min: 0, max: artistIDs.length })
    const shuffled = [...artistIDs].sort(() => Math.random() - 0.5)
    const artistsToLike = shuffled.slice(0, count)

    for (const artistId of artistsToLike) {
      artistLikes.push({
        userId: user.id,
        artistId,
      })
    }
  }

  await prisma.userLikedArtist.createMany({
    data: artistLikes,
    skipDuplicates: true,
  })

  console.log(`Added ${artistLikes.length} random artist likes`)
}

async function main() {
  try {
    const users = await createUsers()
    await createArtists()
    await createArtistReviews(users)
    await createFollows(users)
    await createArtistLikes(users)
    console.log('Seed completed successfully!')
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main();
