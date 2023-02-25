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

export TSP;

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

const graph = [
    [0, 10, 15, 20], 
    [10, 0, 35, 25], 
    [15, 35, 0, 30], 
    [20, 25, 30, 0]
];

let address_ids = [1, 2, 3, 4];
let source = 2;

let result = TSP(graph, address_ids, source);

console.log(result.min_path);
console.log(result.best_path);
