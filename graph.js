class Graph{

    constructor(noOfvert) 
    {
        console.log('weclome')
        this.noOfvert = noOfvert; 
        this.AdjList = new Map(); 
    }
    addVertex(v)
    {
        this.AdjList.set(v,[]); 
    }
    addEdge(v, w)
    {
        this.AdjList.get(v).push(w); 
    }

    helper(directions, node)
    {
        console.log(node);

        directions[node - 1] = true;  

        var connectedKnowledge = this.AdjList.get(node); 

        for(var curr in connectedKnowledge)
        {
            var element = connectedKnowledge[curr]; 
            if(!directions[element - 1])
            {
                this.helper(directions, element); 
            }
        }
     }
    
    algorithm(directions, startNode)
    {
        if(!directions[startNode - 1])
        {
            this.helper(directions, startNode); 
        }
    }
}
