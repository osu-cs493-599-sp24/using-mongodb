const { Router } = require('express')
const { ObjectId } = require("mongodb")

const { getDb } = require("../mongodb")

const router = Router()

router.get('/', async function (req, res, next) {
    const db = getDb()
    try {
        const collection = db.collection("lodgings")
        const count = await collection.countDocuments()

        const pageSize = 10
        let page = parseInt(req.query.page) || 1
        page = page < 1 ? 1 : page
        const offset = (page - 1) * pageSize

        const results = await collection.find({})
            .sort({ _id: 1 })
            .skip(offset)
            .limit(pageSize)
            .toArray()

        res.status(200).send({
            lodgings: results,
            count: count
        })
    } catch (e) {
        next(e)
    }
})

router.post('/', async function (req, res, next) {
    const db = getDb()
    try {
        const collection = db.collection("lodgings")
        const result = await collection.insertOne(req.body)
        res.status(201).send({
            id: result.insertedId
        })
    } catch (e) {
        next(e)
    }
})

router.get('/:id', async function (req, res, next) {
    const id = req.params.id
    const db = getDb()
    try {
        const collection = db.collection("lodgings")

        // const results = await collection.find({
        //     _id: new ObjectId(id)
        // }).toArray()

        const results = await collection.aggregate([
            { $match: { _id: new ObjectId(id) } },
            { $lookup: {
                from: "reservations",
                localField: "_id",
                foreignField: "lodgingId",
                as: "reservations"
            }}
        ]).toArray()


        if (results.length > 0) {
            res.status(200).send(results[0])
        } else {
            next()
        }
    } catch (e) {
        next(e)
    }
})

router.patch('/:id', function (req, res, next) {
    const id = req.params.id
    res.status(200).send({})
})

router.delete('/:id', function (req, res, next) {
    const id = req.params.id
    res.status(204).send()
})

module.exports = router
