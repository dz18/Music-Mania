const { faker } = require('@faker-js/faker');
const artistIDs = require('./seed/artistIDs.json')
const prisma = require('./client');

const ratingOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

async function main() {

  let users = []
  for (let i = 0; i < 50; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
        avatar: faker.image.avatar(),
        aboutMe: faker.lorem.sentences({min: 0, max:5})
      }
    })

    users.push(user)
  }

  await Promise.all(
    users.map(async user => {
      const numOfReviews = faker.number.int({min: 1, max: 5})
      const artistSet = new Set()
      const reviewPromises = []
      while(artistSet.size < numOfReviews) {

        const randomArtist = artistIDs[Math.floor(Math.random() * artistIDs.length)]

        if (artistSet.has(randomArtist)) continue

        const rating = ratingOptions[Math.floor(Math.random() * ratingOptions.length)]
        const comment = faker.lorem.sentences({min: 0, max: 10})
        reviewPromises.push(
          prisma.review.create({
            data: {
              itemId: randomArtist,
              userId: user.id,
              comment: comment,
              rating: rating,
              type: 'ARTIST',
              status: 'PUBLISHED'
            }
          })
        )
        artistSet.add(randomArtist)
      }
      await Promise.all(reviewPromises)
  }))
    
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(() => prisma.$disconnect())