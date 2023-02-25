import axios from 'axios'
import fs from "fs"
import { parse } from "csv-parse"

let location_data = [];

fs.createReadStream("./delivery-data/sample-location.csv")
.pipe(parse({ delimiter: ",", from_line: 2}))
.on("data", (row) => {
	location_data.push(row);
})

await new Promise(r => setTimeout(r, 2000));

let distance = [];
let duration = [];

let key = "AIzaSyDg64WEaXKx-ZOBBg_oklSYxpbP3koFp90";
let origin, destination;

for (let i = 0; i < location_data.length; i++) {

	array.push([]);

	for (let j = 0; j < location_data.length; j++) {

		origin = location_data[i][1];
		destination = location_data[j][1];
		
		let response = await axios.get(
			`https://maps.googleapis.com/maps/api/distancematrix/json?` +
			`origins=${origin.replace([" ", ","], ["%20", "%2C"])}&` + 
			`destinations=${destination.replace([" ", ","], ["%20", "%2C"])}` + 
			`&units=SI&key=${key}`
		);

		distance[i].push(parseFloat(response.data.rows[0].elements[0].distance.text.split(" ")[0]));
		duration[i].push(parseFloat(response.data.rows[0].elements[0].duration.text.split(" ")[0]));
	}
}

console.log(distance);
console.log(duration);