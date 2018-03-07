/*
var endpoint = "http://155.41.109.95:9000";
var hasher;
var nonceSize = 64;
var ethashParams = defaultParams();
// if the browser cannot find a solution within these many miliseconds, we give it a new block to mine
// units = ms
var timeToGetCurrentBlock = 10000000;
// the hash must be less than the following for the nonce to be a valid solutions
var solutionThreshold = 10**72;

http_get(endpoint);


function http_get(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl+"/get", true ); // true for asynchronous request, false for synchronous
    xmlHttp.onload = function callback() 
    {
    	if (xmlHttp.readyState === 4) 
    	{
    		if (xmlHttp.status === 200) 
    		{
    			// console.log(xmlHttp.responseText);
    			start_mine(xmlHttp.responseText);
    		} 
    		else 
    		{
      			return null;
    		}
  		}
    }
    xmlHttp.send(null);
}


function http_post(theUrl,data) 
{
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", theUrl+"/post", false );
    xmlHttp.setRequestHeader("Content-type", "application/json");
    cacheHits = 0;
    cacheMisses = 0;
    // console.log(data);
    xmlHttp.send(data);
    return;	
}

// the main while loop
function start_mine(response) 
{
	// get the block the node is currently mining
	var response = JSON.parse(response);
	
	// header = Array
	header = Uint32Array.from(response["header"]);

	// cache = 1D Array
	var cache = Uint32Array.from(response["cache"]);

	hasher = new Ethash(ethashParams,cache);

	// get the mined block (could be null if solution was not found in the given time limit)

	var solution = mine(header);
	// if an actual solution was found, ship it over to the node
	if (solution != null)
	{
		var resp = http_post(endpoint,solution);
	}
	http_get(endpoint);
	return;

}

function mine(header)
{
	// console.log("Inside miner function");
	var solution = null;
	var nonce = null;
	var result = null;
	var digest = null;
	var total_time = 0;
	var num_hashes = 0;
	var avg_hashrate = 0;
	startTime = Date.now();
	while(true)
	{
		// get a random nonce
		nonce = Math.floor(Math.random() * 2**nonceSize);
		nonceAsArray = Util.longToByteArray(nonce);
		// get the hash for the current nonce and block
		var stimer = Date.now();
		// [digest,result] = hasher.hash(header,nonceAsArray);
		result = hasher.hash(header,nonceAsArray);
		var etimer = Date.now();
		total_time = total_time +(etimer - stimer);
		num_hashes = num_hashes + 1;
		if (num_hashes == 200)
		{
			avg_hashrate = (num_hashes / total_time) * 1000; // millisecond precision
			alert(avg_hashrate);
			// return;
		}
		
		// if hash is less than the threshold, prepare the solution and return
		// var hash = Util.bytesToHexString(result);
		// if (parseInt(hash,16) < solutionThreshold)
		// {
		// 	console.log("VALID NONCE FOR RESULT: " + hash);
		// 	var solution = JSON.stringify({WorkerDigest:Util.serializeIterableObject(digest),WorkerNonce:nonce,WorkerResult:Util.serializeIterableObject(result)});
		// 	return solution;
		// }
		// // else if you surpass a given time window while running the mining function,
		// // you simply return null
	 //    now = Date.now();
	 //    if ( (now - startTime) > timeToGetCurrentBlock) 
	 //    {
	 //        return solution;
	 //    } 

	}
}
*/

/*
http_get(endpoint);

function start_mine(response){
	// init params
//ethashParams.cacheRounds = 0;
var parsedResponse = JSON.parse(response);
// header = Array
var header = Uint32Array.from(parsedResponse["header"]);

// 	// cache = 1D Array
var cache = Uint32Array.from(parsedResponse["cache"]);

*/
var ethashParams = defaultParams();
var seed = Util.hexStringToBytes("9410b944535a83d9adf6bbdcc80e051f30676173c16ca0d32d6f1263fc246466");
var seedWords = convertSeed(seed);
var cache = computeCache(ethashParams,seedWords);
var startTime = new Date().getTime();
var hasher = new Ethash(ethashParams, cache);
console.log('Ethash startup took: '+(new Date().getTime() - startTime) + "ms");
console.log('Ethash cache hash: ' + Util.bytesToHexString(hasher.cacheDigest()));

var testHexString = "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470";
if (testHexString != Util.bytesToHexString(Util.hexStringToBytes(testHexString)))
	throw Error("bytesToHexString or hexStringToBytes broken");

		
var header = Util.hexStringToBytes("c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");

var nonce = Util.hexStringToBytes("0000000000000000");
var hash;

startTime = new Date().getTime();
var trials = 10;
for (var i = 0; i < trials; ++i)
{
	hash = hasher.hash(header, nonce);
	nonce[0]=nonce[0]+1;
}
var hashrate = 1000/((new Date().getTime() - startTime)/trials)
console.log("Light client hashes average hashrate: " + hashrate);
alert(hashrate);
console.log("Hash = " + Util.bytesToHexString(hash));

// }