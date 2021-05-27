import chalk from "chalk";

require('dotenv').config()
const { MongoClient } = require("mongodb");
const uri = process.env["mongodb"]

const mongoclient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let db
async function run() {
    try {
        await mongoclient.connect().then(() => {
            db = mongoclient.db(`bot`)
        })

        console.log(chalk.blue(`Connected to MongoDB!`))

    } finally { }
}
run().catch(console.dir)

async function read(messageGuildID: string) {
    return await db.collection(`guildsv2`)
        .find({ guildID: messageGuildID })
        .toArray()
}

async function isInDB() {
    return await db.collection(`guildsv2`).find().toArray()
}

async function add(messageGuildID: string) {
    const defaultDBSchema = {
        guildID: messageGuildID,
        guildSettings: {
            prefix: `-`,
            welcomeChannel: `null`,
            welcomeMessage: `null`,
            loggingChannels: {
                messageLogs: `null`,
                memberLogs: `null`,
                moderationLogs: `null`
            },
            staffRoles: {
                admin: `null`,
                srMod: `null`,
                moderator: `null`,
                helper: `null`,
                trialHelper: `null`
            }
        },
        tags: []
    }

    let allDB = await isInDB()

    for (let e of allDB) {
        if (e.guildID == messageGuildID) {
            return
        }
    }

    return await db.collection(`guildsv2`)
        .insertOne(defaultDBSchema)
}

//THIS WILL PROBABLY BREAK EVERYTHING IF USED, SO DON'T FUCKING USE IT
async function addOverrideOther(messageGuildID: string) {
    const defaultDBSchema = {
        guildID: messageGuildID,
        guildSettings: {
            prefix: `-`,
            welcomeChannel: `null`,
            welcomeMessage: `null`,
            loggingChannels: {
                messageLogs: `null`,
                memberLogs: `null`,
                moderationLogs: `null`
            },
            staffRoles: {
                admin: `null`,
                srMod: `null`,
                moderator: `null`,
                helper: `null`,
                trialHelper: `null`
            }
        },
        tags: []
    }

    return await db.collection(`guildsv2`)
        .insertOne(defaultDBSchema)
}

async function addTag(messageGuildID: string, tagName: string, tagResponse: string) {
    let query = { guildID: messageGuildID }
    let update = { $push: { tags: { name: tagName, value: tagResponse } } }

    return await db.collection(`guildsv2`)
        .updateOne(query, update)
}

async function editTag(messageGuildID: string, tagName: string, newTagResponse: string) {
    let query = { guildID: messageGuildID, tags: { $elemMatch: { name: tagName } } }
    let update = { $set: { "tags.$.value": newTagResponse } }

    return await db.collection(`guildsv2`)
        .updateOne(query, update)
}

async function deleteTag(messageGuildID: string, tagName: string) {
    let query = { guildID: messageGuildID }
    let update = { $pull: { tags: { name: tagName } } }

    return await db.collection(`guildsv2`)
        .updateOne(query, update)
}

async function guildSettings(messageGuildID: string) {
    const data = await read(messageGuildID)
    return data[0].guildSettings
}

async function editGuildSettingsPerms(messageGuildID: string, roleToEdit: string, newRole: string) {
    let query = { guildID: messageGuildID }
    let object = { ["guildSettings.staffRoles." + roleToEdit]: newRole }
    let update = { $set: object }

    return await db.collection(`guildsv2`)
        .updateOne(query, update)
}

export = {
    read,
    add,
    addTag,
    editTag,
    deleteTag,
    guildSettings,
    addOverrideOther,
    editGuildSettingsPerms
}