
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

function serializeHeader(header) {
	// body...
}

function serializeCache(cache) {
	// body...
}

function mine(header,cache){

	// Accessing cpp bindings)
	var headerStr = serializeHeader(header);
	var cacheStr = serializeCache(cache);

	Module.mine(headerStr,cacheStr,cache.length);

	var hashrate = new Module.Ethash(ethashParams, cache);
	
	console.log("Light client hashes average hashrate: " + hashrate);
	alert(hashrate);
}