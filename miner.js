WORD_BYTES = 4; //                    # bytes in word
DATASET_BYTES_INIT = 2**30; //        # bytes in dataset at genesis
DATASET_BYTES_GROWTH = 2**23; //      # dataset growth per epoch
CACHE_BYTES_INIT = 2**24; //          # bytes in cache at genesis
CACHE_BYTES_GROWTH = 2**17; //        # cache growth per epoch
CACHE_MULTIPLIER=1024; //             # Size of the DAG relative to the cache
EPOCH_LENGTH = 30000; //              # blocks per epoch
MIX_BYTES = 128; //                   # width of mix
HASH_BYTES = 64; //                   # hash length in bytes
DATASET_PARENTS = 256; //             # number of parents of each dataset element
CACHE_ROUNDS = 3; //                  # number of rounds in cache production
ACCESSES = 64; //                     # number of accesses in hashimoto loop


// function: makes request
// string theUrl = URL of endpoint
// string method = GET / POST

// convert keyword arg to js equivalent
function http(theUrl,method,data=null)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open(method, theUrl, false ); // false for synchronous request
    xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");
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

// function reverseString(str)
// {

//     return str.split("").reverse().join("")

// }

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
    console.log(nonce);
    var nonce_array = [nonce];
    var s = Sha3.hash256(header.concat(nonce_array));
    // compress mix

    // convert to js equivalent
    cmix = new Array();
    var mixlen = mix.length;
    for (i = 0; i < mixlen; i += 4)
    {
        cmix.push(fnv(fnv(fnv(mix[i], mix[i+1]), mix[i+2]), mix[i+3]));
    }
    // convert to js equivalent
    var obj = 
    {
        "mix digest": serialize_hash(cmix),
        "result": serialize_hash(Sha3.hash256(s+cmix))
    }
    console.log("Result: " + obj["result"])
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

// document.domain = "localhost";
// the main while loop
while (true)
{
	// get the block the node is currently mining
	var response = http(endpoint,"GET");
	var response = JSON.parse(response);
	// header = Array
	var header = response["header"];
	console.log(response["header"]);

	var fullsize = response["fullsize"];
	console.log(response["fullsize"]);

	// mix = DAG slices = Array
	var mix = response["mix"];
	// get the mined block (could be null if solution was not found in the given time limit)
	var solution = mine(header,fullsize,mix);
	// if an actual solution was found, ship it over to the node
	if (solution != null)
	{
		http(endpoint,"POST",solution);
	}
}
