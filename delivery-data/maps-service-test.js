import axios from 'axios'

let key = "AIzaSyDg64WEaXKx-ZOBBg_oklSYxpbP3koFp90";
let origin = "NTU Hall of Residence 9".replace([" ", ","], ["%20", "%2C"]);
let desination = "NTU Hall of Residence 5".replace([" ", ","], ["%20", "%2C"]);


let response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${desination}&units=SI&key=${key}`);
console.log(response.data);

