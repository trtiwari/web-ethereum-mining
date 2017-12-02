// link to our node's rpc endpoint
var nodeLink = "ws://localhost:8546"
// connect to node
var web3 = new Web3(nodeLink);
// we generate random nonces of 32 bytes and test if they work
var nonceSize = 32;
// if the browser cannot find a solution within these many miliseconds, we give it a new block to mine
// units = ms
var timeToGetCurrentBlock = 100000;
// the hash must be less than the following for the nonce to be a valid solutions
var solutionThreshold = 100000000000000;

function hash(nonce,block)
{
	// needs to return the hash and the digest as an array of the format : [hash,digest]
	return null
}

function mine(block)
{
	var digest = null;
	var solution = null;
	var nonce = null;
	var hash = null;
	startTime = new Date().getTime();
	while(true)
	{
		// get a random nonce
		nonce = parseInt(web3.utils.randomHex(nonceSize), 16);
		// get the hash for the current nonce and block
		[hash,digest] = hash(nonce,block);
		// if hash is less than the threshold, prepare the solution and return
		if (hash < solutionThreshold)
		{
			solution = new Array(3);
			solution[0] = nonce;
			solution[1] = hash
			solution[2] = digest;
			return solution;
		}
		// else if you surpass a given time window while running the mining function,
		// you simply return null
	    now = new Date().getTime();
	    else if( (now - startTime) > timeToGetCurrentBlock) 
	    {
	        return solution;
	    } 
	}
}

// the main while loop
while (true)
{
	// get the block the node is currently mining
	block = web3.eth.getBlock("pending",true);
	// get the mined block (could be null if solution was not found in the given time limit)
	solution = mine(block);
	// if an actual solution was found, ship it over to the node
	if (solution != null)
	{
		nonce = solution[0];
		powHash = solution[1];
		digest = solution[2];
		web3.eth.submitWork(nonce, powHash, digest);
	}
}