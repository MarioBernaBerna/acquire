const { add_product } = require("./mongoService");

const KUNNA_URL = "https://openapi.kunna.es/data/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjM2NDEwNjB9.ixb4O5Jgk-e_oPMSsycpD7A_iGVqIl4Ijl2a_kLrT94";

// alias fijo del contador (ya no usamos uid)
const ALIAS = "6339651";

/*
 Llama a Kunna con un rango [timeStart, timeEnd]
 y devuelve el objeto { columns, values }.
*/

async function fetchKunna(timeStart, timeEnd) {
  const url = KUNNA_URL;

  const headers = {
    "Content-Type": "application/json"
  };

  const body = {
    time_start: timeStart.toISOString(),
    time_end: timeEnd.toISOString(),
    filters: [
      { filter: "name", values: ["1d"] },
      { filter: "alias", values: [ALIAS] }
    ],
    limit: 100,
    count: false,
    order: "DESC"
  };

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`KUNNA_BAD_STATUS:${response.status}`);
  }

  const json = await response.json();
  const result = json.result;

  if (!result || !Array.isArray(result.columns) || !Array.isArray(result.values)) {
    throw new Error("KUNNA_INVALID_RESULT");
  }
  //Guardamos en BD
  const daysused = result.values.map(row => {
    const date = new Date(row[0]);        
    return date.toISOString().slice(0, 10);
  });

  let kunnaMeta = {
    alias : ALIAS,
    name : "id",
    daysused : daysused
  }

  let fetchMeta = {
    time_start : timeStart,
    time_end : timeEnd,
    source : "Acquire",
    __v : 0
  }

  const id = await add_product(kunnaMeta, fetchMeta)

  return [id, result]; // { columns, values }
}

module.exports = { fetchKunna };
