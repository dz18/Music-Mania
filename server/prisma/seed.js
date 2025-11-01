const { faker } = require('@faker-js/faker');
const artistIDs = require('./seed/artistIDs.json')
const prisma = require('./client');
const bcrypt = require('bcrypt')

const ratingOptions = [1,2,3,4,5]


async function main() {

  // Create TEST Admin User
  const hashedPassword = await bcrypt.hash(process.env.PASSWORD, 10)
  await prisma.user.upsert({
    where: {username: process.env.USERNAME},
    create: {
      email: process.env.EMAIL,
      password: hashedPassword,
      username: process.env.USERNAME
    },
    update: {}
  })

  // Create Users
  let userPromises = []
  for (let i = 0; i < 25; i++) {
    userPromises.push(
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          username: faker.internet.username(),
          password: await bcrypt.hash(faker.internet.password(), 10),
          avatar: faker.image.avatar(),
          phoneNumber: faker.phone.number(),
          aboutMe: faker.lorem.sentences(Math.floor(Math.random() * 6))
        }
      })
    )
  }

  const users = await Promise.all(userPromises)

  // Create Artist
  const artistIDs = [
    "6925db17-f35e-42f3-a4eb-84ee6bf5d4b0",
    "2baf3276-ed6a-4349-8d2e-f4601e7b2167",
    "0e24f776-4158-4934-8b78-b4b1edb3ad62"
  ]
  await Promise.all([
    prisma.artist.create({
      data: {
        id: artistIDs[0],
        name: 'Olivia Rodrigo',
      }
    }),
    prisma.artist.create({
      data: {
        id: artistIDs[1],
        name: 'Playboi Carti',
      }
    }),
    prisma.artist.create({
      data: {
        id: artistIDs[2],
        name: 'LSD and The Search For God',
      }
    }),

  ])

  // Create Artist Reviews
  let artistReviewPromises = []
  for (let user of users) {
    for (let artistId of artistIDs) {
      const reviewWordCount = faker.number.int({min: 0, max: 10})
      const titleWordCount = faker.number.int({min: 0, max: 10})
      const review = reviewWordCount === 0 ? null : faker.lorem.sentences(reviewWordCount)
      const title = titleWordCount === 0 ? null : faker.lorem.sentence(titleWordCount)
      artistReviewPromises.push(
        prisma.userArtistReviews.create({
          data: {
            userId: user.id,
            artistId: artistId,
            rating: faker.number.int({min: 1, max: 5}),
            title: title,
            review: review,
            status: 'PUBLISHED'
          }
        })
      )
    }
  }

  await Promise.all(artistReviewPromises)

}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(() => prisma.$disconnect())