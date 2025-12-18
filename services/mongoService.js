'use strict'
const Acquire = require('../models/acquire');

async function add_product(kunnaMeta, fetchMeta){
    const acquire_saved = await Acquire.create({
        kunnaMeta : kunnaMeta,
        fetchMeta : fetchMeta
    })
    return acquire_saved._id.toString();
}
module.exports = { add_product };