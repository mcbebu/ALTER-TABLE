import axios from 'axios'
import fs from "fs"
import { parse } from "csv-parse"

const TSP = (graph, address_ids, source) => {
    
    let v = graph.length;
    let min_path = Number.MAX_VALUE;

    let vertex = [];
    let best_path = new Array(v - 1).fill(0);

    for (let i = 0; i < v; i++) if (i !== source) vertex.push(i);

    do {
        
        let current_pathweight = 0;
        let k = source;
        
        for (let i = 0; i < vertex.length; i++) {
            current_pathweight += graph[k][vertex[i]];
            k = vertex[i];
        }

        current_pathweight += graph[k][source];
        
        if (current_pathweight < min_path) {
  
            min_path = current_pathweight;
            console.log(vertex);
            for (let i = 0; i < best_path.length; i++) best_path[i] = vertex[i];
        }
        
    } while (findNextPermutation(vertex));

    best_path = [source].concat(best_path).concat([source]);
    for (let i = 0; i < best_path.length; i++) best_path[i] = address_ids[best_path[i]];

    return {
        "min_path": min_path,
        "best_path": best_path
    };
}


const findNextPermutation = (data) => {
    
    if (data.length <= 1) return false;
    let last = data.length - 2;
    
    while (last >= 0) {
        if (data[last] < data[last + 1]) break;
        last--;
    }
    
    if (last < 0) return false;
    let nextGreater = data.length - 1;
    
    for (let i = data.length - 1; i > last; i--) {
        if (data[i] > data[last]) {
            nextGreater = i;
            break;
        }
    }
    
    [data[nextGreater], data[last]] = [data[last], data[nextGreater]];

    data = [].concat(
        data.slice(0, last),
        data.slice(last + 1, data.length - 1).reverse, 
        data.slice(data.length)
    )
    
    return true;
}

let location_data = [];
let address_ids = [];


fs.createReadStream("./delivery-data/sample-location.csv")
	.pipe(parse({ delimiter: ",", from_line: 2}))
	.on("data", (row) => {
		location_data.push(row);
		address_ids.push(row[0]);
	})

await new Promise(r => setTimeout(r, 2000));

let distance = [];
let duration = [];

let key = "AIzaSyDg64WEaXKx-ZOBBg_oklSYxpbP3koFp90";
let origin, destination;

for (let i = 0; i < location_data.length; i++) {

	distance.push([]);
	duration.push([]);

	for (let j = 0; j < location_data.length; j++) {

		origin = location_data[i][1];
		destination = location_data[j][1];
		
		let response = await axios.get(
			`https://maps.googleapis.com/maps/api/distancematrix/json?` +
			`origins=${origin.replace([" ", ","], ["%20", "%2C"])}&` + 
			`destinations=${destination.replace([" ", ","], ["%20", "%2C"])}` + 
			`&units=SI` +
			`&key=${key}`
		);

		distance[i].push(parseFloat(response.data.rows[0].elements[0].distance.text.split(" ")[0]));
		duration[i].push(parseFloat(response.data.rows[0].elements[0].duration.text.split(" ")[0]));
	}
}

const graph = distance;
let source = 0;

let result = TSP(graph, address_ids, source);

console.log(result.min_path);
console.log(result.best_path);

// console.log(distance);
// console.log(duration);