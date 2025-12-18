'use strict';
const { fetchKunna } = require('../services/KunnaService');

async function getKunnaMeta(req, res) {
    const now = new Date();

    let target_date = new Date();
    if (now.getHours() >= 23) {
        target_date.setDate(target_date.getDate() + 1);
    }

    const time_end = new Date(target_date);
    time_end.setDate(time_end.getDate() - 1);

    const time_start = new Date(time_end);
    time_start.setDate(time_start.getDate() - 3);
    try {
        const [dataId, result] = await fetchKunna(time_start, time_end);
        let features = [];
        for (const row of result.values){
            features.push(row[2]);
        }
        features.push(target_date.getHours());
        features.push(target_date.getDay());
        features.push(target_date.getMonth());
        features.push(target_date.getDate());
        const ahora = new Date().toISOString();
        const response = {
            dataId : dataId,
            features: features,
            featureCount: 7,
            scalerVersion: "v1",
            createdAt: ahora,

        } 
        res.status(201).json({response}); // entre claves hace que sea response : {} y no directamente el contenido, afecta al acceder desde orchester
    }
    catch (err){
        console.error("Error en fetchKunna: ", err);
        res.status(500).json({error : "Kunna error"});
    }
}

function health(req, res){
    res.json({
        status: "ok",
        service: "acquire"
    });
}
module.exports = {
    getKunnaMeta,
    health
};