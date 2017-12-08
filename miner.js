// import * as Sha3 from 'sha3.js';

// function: makes request
// string theUrl = URL of endpoint
// string method = GET / POST

// convert keyword arg to js equivalent
function http(theUrl,method,data=null)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open(method, theUrl, false ); // false for synchronous request
    xmlHttp.send(data);
    if (method == "POST")
    {
    	http.setRequestHeader("Content-type", "application/json");
    }
    return xmlHttp.responseText;
}

// link to our node's rpc endpoint
var endpoint = "http://localhost:8000";

// we generate random nonces of 64 bytes and test if they work
var nonceSize = 64;

// if the browser cannot find a solution within these many miliseconds, we give it a new block to mine
// units = ms
var timeToGetCurrentBlock = 100000;
// the hash must be less than the following for the nonce to be a valid solutions
var solutionThreshold = 100000000000000;

function reverseString(str)
{

    return str.split("").reverse().join("")

}

// Array(ints) header = block header
// Array(ints) mix = slices of the dag
// int fullsize = size of dag
function hash(header, nonce, full_size, mix)
{
    var n = full_size / HASH_BYTES;
    var w = Math.floor(MIX_BYTES / WORD_BYTES);
    var mixhashes = MIX_BYTES / HASH_BYTES;
    // combine header+nonce into a 64 byte seed

    // convert string slicing to js equivalent
    // TO DO -- header is an array, and nonce is a string, not sure if adding them will give us anything
    // probably should convert nonce to an int and append to header and then calculate Sha3.
    var s = Sha3.hash256(header + reverseString(nonce));
    // compress mix

    // convert to js equivalent
    cmix = new Array();
    var mixlen = len(mix)
    for (i = 0; i < mixlen; i += 4){
        cmix.push(fnv(fnv(fnv(mix[i], mix[i+1]), mix[i+2]), mix[i+3]));
    }
    // convert to js equivalent
    var obj = 
    {
        "mix digest": serialize_hash(cmix),
        "result": serialize_hash(Sha3.hash256(s+cmix))
    }
    return obj
}

function mine(header,fullsize,mix)
{
	var solution = null;
	var nonce = null;
	startTime = new Date().getTime();
	while(true)
	{
		// get a random nonce
		// FIX
		nonce = Math.floor(Math.random() * 2**nonceSize);
		// get the hash for the current nonce and block
		result = hash(header,nonce,fullsize,mix);
		// if hash is less than the threshold, prepare the solution and return
		if (result["result"] < solutionThreshold)
		{
			solution = new Array(3);
			solution[0] = nonce;
			solution[1] = result["result"];
			solution[2] = result["mix digest"];
			return solution;
		}
		// else if you surpass a given time window while running the mining function,
		// you simply return null
	    now = new Date().getTime();
	    if ( (now - startTime) > timeToGetCurrentBlock) 
	    {
	        return solution;
	    } 
	}
}

// the main while loop
while (true)
{
	// get the block the node is currently mining
	var response = http(endpoint,"GET");
	console.log(response);
	// header = Array
	var header = response["header"];
	var fullsize = response["fullsize"];
	// mix = DAG slices = Array
	var mix = response["mix"];
	// get the mined block (could be null if solution was not found in the given time limit)
	var solution = mine(block);
	// if an actual solution was found, ship it over to the node
	if (solution != null)
	{
		http(endpoint,"POST",solution);
	}
}
