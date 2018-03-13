importScripts("ethash.js","keccak.js","makekeccak.js","util.js");

var endpoint = "http://155.41.39.73:9000";

function http_get(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    // true for asynchronous request, false for synchronous
    xmlHttp.open("GET", theUrl+"/get", true );
    xmlHttp.onload = function callback() 
    {
    	if (xmlHttp.readyState === 4) 
    	{
    		if (xmlHttp.status === 200) 
    		{
    			var parsedResponse = JSON.parse(xmlHttp.responseText);
    			var cacheSize = parseInt(parsedResponse["cacheSize"]);
				var dagSize = parseInt(parsedResponse["dagSize"]);
				// header = 1D Array of 32 bit ints
				var header = Uint32Array.from(parsedResponse["header"]);
				// cache = 1D Array of 32 bit ints
				var cache = Uint32Array.from(parsedResponse["cache"]);
				var dagArray = parsedResponse["dag"];
				var startIndex = parseInt(parsedResponse["startIndex"]);
				var endIndex = parseInt(parsedResponse["endIndex"]);
    			mine(header,cache,cacheSize,dagArray,dagSize,startIndex,endIndex);
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
    xmlHttp.send(data);
    return;	
}

http_get(endpoint);

function mine(header,cache,cacheSize,dagArray,dagSize,startIndex,endIndex){
	// the hash must be less than the following for the nonce to be a valid solutions
	var solutionThreshold = 10**72;
	// if the browser cannot find a solution within these many miliseconds, we give it a new block to mine
	var timeToGetCurrentBlock = 10000000; // ms

	var ethashParams = defaultParams(cacheSize,dagSize);
	var hasher = new Ethash(ethashParams,cache,dagArray,startIndex,endIndex);

	var nonce = Util.hexStringToBytes("0000000000000000");
	var hash;

	startTime = new Date().getTime();
	var trials = 1000000;
	for (var i = 0; i < trials; ++i)
	{
		[hash,result] = hasher.hash(header, nonce);

		nonce[Math.floor((Math.random()*8))]=Math.floor((Math.random()*256));

		if (parseInt(Util.bytesToHexString(hash),16) < solutionThreshold)
		{
			console.log("VALID NONCE FOR RESULT: " + Util.bytesToHexString(hash));
			var solution = JSON.stringify({WorkerDigest:Util.serializeIterableObject(hash),WorkerNonce:nonce,WorkerResult:Util.serializeIterableObject(result)});
			http_post(endpoint,solution);
			http_get(endpoint);
			return;
		}
		else if (new Date().getTime() - startTime > timeToGetCurrentBlock)
		{
			console.log("TIME UP!");
			http_get(endpoint);
			return;
		}
	}
	var average_time = (new Date().getTime() - startTime)/trials;
	console.log("Hashrate: " + (1000/average_time));
	console.log("Cache hit rate: " + (cacheHits/numAccesses));
}

/*
decrease mining difficulty
https://ethereum.stackexchange.com/questions/2539/how-do-i-decrease-the-difficulty-on-a-private-testnet
*/