
var endpoint = "http://10.192.75.95:9000";

function nibbleToChar(nibble)
{
		return String.fromCharCode((nibble < 10 ? 48 : 87) + nibble);
}

function bytesToHexString(bytes)
{
	var str = "";
	for (var i = 0; i != bytes.length; ++i)
	{
		str += nibbleToChar(bytes[i] >>> 4);
		str += nibbleToChar(bytes[i] & 0xf);
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

function serialize(arr) 
{
	var arrStr = ""
	for (var i = 0; i < arr.length; i++)
	{
		arrStr += arr[i].toString();
		arrStr += " ";
	}
	return arrStr;
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
				var cacheSize = parseInt(parsedResponse["cacheSize"]);

				var dag = Uint32Array.from(parsedResponse["dag"]);
				var startIndex = parseInt(parsedResponse["startIndex"]);
				var dagSize = parseInt(parsedResponse["dagSize"]);
				var headerStr = serialize(header);
				var cacheStr = serialize(cache);
				var dagStr = serialize(dag);
    			mine(headerStr,cacheStr,dagStr,startIndex,cacheSize,dagSize);
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

function mine(headerStr,cacheStr,dagStr,startIndex,cacheSize,dagSize){

	// Accessing cpp bindings
	var hashrate = Module.mine(headerStr,cacheStr,dagStr,startIndex,cacheSize,dagSize);	
	console.log("Light client hashes average hashrate: " + hashrate);
	alert(hashrate);
}

// allocate 208 MB memory
// emcc --bind -o glue.js miner.cpp -w -O3 -s TOTAL_MEMORY=218103808
// emcc --bind -o glue.js miner.cpp -w -O3 -s ALLOW_MEMORY_GROWTH=1