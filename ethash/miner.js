var endpoint = "http://localhost:9000";

function http_get(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, true ); // true for asynchronous request, false for synchronous
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

var hasher;
http_get(endpoint);
// the main while loop
function start_mine(response) 
{
	// get the block the node is currently mining
	var response = JSON.parse(response);
	console.log(response)
	// header = Array
	var header = response["header"];

	// cache = 1D Array
	var cache = response["cache"];
	console.log('Ethash cache hash: ' + Util.bytesToHexString(hasher.cacheDigest()));

	hasher = new Ethash(ethashParams,cache);

	header = Util.hexStringToBytes(header);
	console.log("Header Length",header.length)
	// get the mined block (could be null if solution was not found in the given time limit)

	// console.log("Got response, beginning to Mine");
	var solution = mine(header);
	// if an actual solution was found, ship it over to the node
	if (solution != null)
	{
		var resp = http_post(endpoint,solution);
		console.log(resp);

	}
	http_get(endpoint);
	return;
}

function mine(header)
{
	// console.log("Inside miner function");
	var solution = null;
	var nonce = null;
	// startTime = new Date().getTime();
	var hasher = new Ethash(ethashParams, seed);
	while(true)
	{
		// get a random nonce
		nonce = Math.floor(Math.random() * 2**nonceSize);
		// get the hash for the current nonce and block
		// var stimer = new Date().getTime();
		result = hasher.hash(header,nonce);
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

var ethashParams = defaultParams();
//ethashParams.cacheRounds = 0;

// create hasher
// var seed = Util.hexStringToBytes("9410b944535a83d9adf6bbdcc80e051f30676173c16ca0d32d6f1263fc246466")
// var startTime = new Date().getTime();

// console.log('Ethash startup took: '+(new Date().getTime() - startTime) + "ms");

// var nonce = Util.hexStringToBytes("0000000000000000");
// console.log("Nonce Length",header.length)
// var hash;

// startTime = new Date().getTime();
// var trials = 10;
// for (var i = 0; i < trials; ++i)
// {
// 	hash = hasher.hash(header, nonce);
// }
// console.log("Light client hashes averaged: " + (new Date().getTime() - startTime)/trials + "ms");
// console.log("Hash = " + Util.bytesToHexString(hash));