const { faker } = require('@faker-js/faker');
const artistIDs = require('./seed/artistIDs.json')
const albumIDs = require('./seed/albumIDs.json')
const prisma = require('./client');
const bcrypt = require('bcrypt')

const ratingOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]


async function main() {

  // Create Admin User
  const hashedPassword = await bcrypt.hash(process.env.PASSWORD, 10)
  await prisma.user.create({
    data: {
      email: process.env.EMAIL,
      password: hashedPassword,
      username: process.env.USERNAME
    }
  })

  // Generate Users
  const userPromises = Array.from({ length: 50 }).map(() =>
    prisma.user.create({
      data: {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password(),
        avatar: faker.image.avatar(),
        aboutMe: faker.lorem.sentences({ min: 0, max: 5 })
      }
    })
  )

  const users = await Promise.all(userPromises)

  // Generate Artist Reviews
  await Promise.all(
    users.map(async user => {
      const numOfReviews = faker.number.int({min: 1, max: 5})
      const artistSet = new Set()
      const reviewPromises = []
      while(artistSet.size < numOfReviews) {

        const randomArtist = artistIDs[Math.floor(Math.random() * artistIDs.length)]

        if (artistSet.has(randomArtist)) continue

        const rating = ratingOptions[Math.floor(Math.random() * ratingOptions.length)]
        const review = faker.lorem.sentences({min: 0, max: 10})

        reviewPromises.push(
          prisma.review.create({
            data: {
              itemId: randomArtist,
              userId: user.id,
              review: review,
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
    
  // Generate Album reviews
  await Promise.all(
    users.map(async user => {
      const numOfReviews = faker.number.int({min: 1, max: 5})
      const albumSet = new Set()
      const reviewPromises = []
      
      while(albumSet.size < numOfReviews) {

        const randomAlbum = albumIDs[Math.floor(Math.random() * albumIDs.length)]

        if (albumSet.has(randomAlbum)) continue

        const rating = ratingOptions[Math.floor(Math.random() * ratingOptions.length)]
        const review = faker.lorem.sentences({min: 0, max: 10})

        reviewPromises.push(
          prisma.review.create({
            data: {
              itemId: randomAlbum,
              userId: user.id,
              review: review,
              rating: rating,
              type: 'RELEASE',
              status: 'PUBLISHED'
            }
          })
        )

        albumSet.add(randomAlbum)
      }

      await Promise.all(reviewPromises)
    })
  )
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(() => prisma.$disconnect())