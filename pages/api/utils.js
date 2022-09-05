import prisma from 'lib/prisma'
import AWS from 'aws-sdk'
import { faker } from '@faker-js/faker'

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.end()

    if (req.body.task === 'clean_database') {
        await prisma.user.deleteMany({})
    }

    if (req.body.task === 'generate_content') {
        let usersCount = 0

        while (usersCount < 10) {
            await prisma.user.create({
                data: {
                    name: faker.name.findName(),
                    username: faker.internet.userName().toLowerCase(),
                    email: faker.internet.email().toLowerCase(),
                    image: faker.image.avatar(),
                },
            })
            
            usersCount++
        }

        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
        })

        const videoURL = 'https://bootcamp-richard.s3.us-east-2.amazonaws.com/Icy-Sunrise.mp4'
        const thumbnailURL = 'https://bootcamp-richard.s3.us-east-2.amazonaws.com/sunrise_thumbnail.jpg'

        const users = await prisma.user.findMany()

        const getRandomUser = () => {
            const randomIndex = Math.floor(Math.random() * users.length)
            return users[randomIndex]
        }

        //create 20 videos, randonly assigned to users
        let videosCount = 0

        while (videosCount < 20) {
            await prisma.video.create({
                data: {
                    title: faker.lorem.words(),
                    thumbnail: thumbnailURL,
                    url: videoURL,
                    length: faker.datatype.number(1000),
                    visibility: 'public',
                    views: faker.datatype.number(1000),
                    author: {
                        connect: { id: getRandomUser().id },
                    },
                }
            })
            videosCount++
        }
    }

    res.end()
}