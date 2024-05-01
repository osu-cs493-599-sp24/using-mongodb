const { Router } = require('express')
const { ObjectId } = require("mongodb")

const { getDb } = require("../mongodb")

const router = Router()

router.post('/', async function (req, res, next) {
    const db = getDb()
    try {
        const collection = db.collection("reservations")
        const result = await collection.insertOne({
            ...req.body,
            lodgingId: new ObjectId(req.body.lodgingId)
        })
        res.status(201).send({
            id: result.insertedId
        })
    } catch (e) {
        next(e)
    }
})

module.exports = router
