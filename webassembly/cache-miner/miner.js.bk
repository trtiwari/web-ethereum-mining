
var endpoint = "http://155.41.109.95:9000";

function bytesToHexString(bytes)
{
	var str = "";
	for (var i = 0; i != bytes.length; ++i)
	{
		str += Util.nibbleToChar(bytes[i] >>> 4);
		str += Util.nibbleToChar(bytes[i] & 0xf);
	}
	return str;
}

function serializeIterableObject(iterable) 
{
	var returnVal = new Array(iterable.length)
	const iterableIterator = iterable.values();
	for (var i = 0; i < iterable.length; i++) {
		returnVal[i] = iterableIterator.next().value;
	}
	return returnVal;
}

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
    			var parsedResponse = JSON.parse(xmlHttp.responseText);
    			// header = Array
				var header = Uint32Array.from(parsedResponse["header"]);
				// 	// cache = 1D Array
				var cache = Uint32Array.from(parsedResponse["cache"]);
    			_mine(header,cache);

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

function mine(header,cache){
	// the hash must be less than the following for the nonce to be a valid solutions
	var solutionThreshold = 10**72;
	// if the browser cannot find a solution within these many miliseconds, we give it a new block to mine
	var timeToGetCurrentBlock = 10000000; // ms

	// Accessing cpp bindings)
	var ethashParams = new Module.Params();

	var hasher = new Module.Ethash(ethashParams, cache);
	
	var nonce = Uint8Array([0,0,0,0,0,0,0,0]);
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