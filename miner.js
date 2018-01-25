var WORD_BYTES = 4; //                    # bytes in word
var DATASET_BYTES_INIT = 2**30; //        # bytes in dataset at genesis
var DATASET_BYTES_GROWTH = 2**23; //      # dataset growth per epoch
var CACHE_BYTES_INIT = 2**24; //          # bytes in cache at genesis
var CACHE_BYTES_GROWTH = 2**17; //        # cache growth per epoch
var CACHE_MULTIPLIER=1024; //             # Size of the DAG relative to the cache
var EPOCH_LENGTH = 30000; //              # blocks per epoch
var MIX_BYTES = 128; //                   # width of mix
var HASH_BYTES = 64; //                   # hash length in bytes
var DATASET_PARENTS = 256; //             # number of parents of each dataset element
var CACHE_ROUNDS = 3; //                  # number of rounds in cache production
var ACCESSES = 64; //                     # number of accesses in hashimoto loop
// link to our node's rpc endpoint
var endpoint = "http://localhost:9000";

// we generate random nonces of 64 bytes and test if they work
var nonceSize = 64;

// if the browser cannot find a solution within these many miliseconds, we give it a new block to mine
// units = ms
var timeToGetCurrentBlock = 100000;
// the hash must be less than the following for the nonce to be a valid solutions
var solutionThreshold = 10**75;


// function: makes request
// string theUrl = URL of endpoint
// string method = GET / POST

// convert keyword arg to js equivalent

function calculate_node(cache)
{
	var n = cache.length;
    var r = HASH_BYTES / WORD_BYTES;
    // initialize the mix
    mix = cache[i % n];
    mix[0] ^= i;
    mix = Sha3.hash512(mix);
    // fnv it with a lot of random cache nodes based on i
    for (var j = 0; j < DATASET_PARENTS; j++)
    {
        cache_index = fnv(i ^ j, mix[j % r]);
        // FIXXXX
        mix = mix.map(fnv,cache[cache_index % n]);
    }
    return Sha3.hash512(mix);
}

function http_get(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, true ); // true for asynchronous request, false for synchronous
    // console.log("sent request");
    xmlHttp.onload = function callback() 
    {
    	if (xmlHttp.readyState === 4) 
    	{
    		if (xmlHttp.status === 200) 
    		{
    			// console.log("HTTP/1.1 200: " + xmlHttp.responseText);
    			start_mine(xmlHttp.responseText);
    		} 
    		else 
    		{
      			console.log(xmlHttp.statusText);
      			return null;
    		}
  		}
    }
    xmlHttp.send(null);
}

function http_post(theUrl,data) 
{
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", theUrl, false );
    xmlHttp.setRequestHeader("Content-type", "application/json");
    console.log(data);
    xmlHttp.send(data);
    return;	
}


// Array(ints) header = block header
// Array(ints) mix = slices of the dag
// int fullsize = size of dag
function hash(header, nonce, full_size, cache)
{
    var n = full_size / HASH_BYTES;
    var w = Math.floor(MIX_BYTES / WORD_BYTES);
    var mixhashes = MIX_BYTES / HASH_BYTES;
    // combine header+nonce into a 64 byte seed

    Sha3.hash256(header.push(nonce));
    var s = header;
    // compress mix


 	mix = new Array();
    for (var _ = 0; _ <  MIX_BYTES / HASH_BYTES; _++)
    {
        mix.push(s);
    }
    // mix in random dataset nodes
    for (i = 0; i < ACCESSES; i++)
    {
        p = fnv(i ^ s[0], mix[i % w]) % (n / mixhashes) * mixhashes
        newdata = new Array();
        for (var j = 0; j < MIX_BYTES / HASH_BYTES; j++)
        {
            newdata.push(calculate_node(cache,p + j));
        }
        mix = map(fnv, mix, newdata);
    }
    

    // convert to js equivalent
    cmix = new Array();
    var mixlen = mix.length;
    for (i = 0; i < mixlen; i += 4)
    {
        cmix.push(fnv(fnv(fnv(mix[i], mix[i+1]), mix[i+2]), mix[i+3]));
    }

    var x = s.concat(cmix);
    // convert to js equivalent
    var obj = 
    {
        "mix digest": serialize_hash(cmix),
        "result": Sha3.hash256(x)
    }
    return obj
}

function mine(header,fullsize,mix)
{
	// console.log("Inside miner function");
	var solution = null;
	var nonce = null;
	// startTime = new Date().getTime();
	while(true)
	{
		// get a random nonce
		nonce = Math.floor(Math.random() * 2**nonceSize);
		// get the hash for the current nonce and block
		// var stimer = new Date().getTime();
		result = hash(header,nonce,fullsize,mix);
		// var etimer = new Date().getTime();
		// console.log("Hash rate: ");
		// console.log(etimer - stimer);
		// if hash is less than the threshold, prepare the solution and return
		console.log("Hashed, found result");
		console.log(result["result"]);
		if (parseInt(result["result"],16) < solutionThreshold)
		{
			console.log("VALID NONCE FOR RESULT: " + result["result"]);
			var solution = "START: ";
			solution += nonce;
			solution += ","
			solution += result["result"];
			// no need to send digest as of now;
			// its needed for verification purposes, but not now
			// solution[2] = result["mix digest"];
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

http_get(endpoint);

// the main while loop
function start_mine(response) 
{
	// get the block the node is currently mining
	var response = JSON.parse(response);
	// header = Array
	var header = response["header"];

	var fullsize = response["fullsize"];

	// mix = DAG slices = Array
	var cache = response["cache"];
	// get the mined block (could be null if solution was not found in the given time limit)

	// console.log("Got response, beginning to Mine");
	var solution = mine(header,fullsize,cache);
	// if an actual solution was found, ship it over to the node
	if (solution != null)
	{
		var resp = http_post(endpoint,solution);
		console.log(resp);

	}
	http_get(endpoint);
	return;
}