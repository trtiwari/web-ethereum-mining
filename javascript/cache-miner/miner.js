
var endpoint = "http://155.41.59.239:9000";

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
    xmlHttp.send(data);
    return;	
}


http_get(endpoint);

function start_mine(response){
	// the hash must be less than the following for the nonce to be a valid solutions
	var solutionThreshold = 10**72;
	// if the browser cannot find a solution within these many miliseconds, we give it a new block to mine
	var timeToGetCurrentBlock = 10000000; // ms

	var parsedResponse = JSON.parse(response);
	// header = Array
	var header = Uint32Array.from(parsedResponse["header"]);

	// 	// cache = 1D Array
	var cache = Uint32Array.from(parsedResponse["cache"]);

	var cacheSize = parseInt(parsedResponse["cacheSize"]);
	var dagSize = parseInt(parsedResponse["dagSize"]);

	var ethashParams = defaultParams(cacheSize,dagSize);

	var hasher = new Ethash(ethashParams, cache);
	
	var nonce = Util.hexStringToBytes("0000000000000000");
	var hash;

	startTime = new Date().getTime();
	var trials = 10000;
	for (var i = 0; i < trials; ++i)
	{
		hash = hasher.hash(header, nonce);
		// nonce[0]=nonce[0]+1;
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
	var hashrate = 1000/((new Date().getTime() - startTime)/trials)
	console.log("Light client hashes average hashrate: " + hashrate);
	alert(hashrate);
	console.log("Hash = " + Util.bytesToHexString(hash));
}