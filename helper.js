var FNV_PRIME = 0x01000193;

function encode_int(s)
{
	// converts int to hex string and reverses the 
	//a = "%x" % s
	var hex = s.toString(16);
	return hex.split("").reverse().join("");
	// if (s == 0)
	// {
	// 	return '';
	// }
	// else
	// {	
	// 	var str = "";
	// 	for (var i = 0; i < a.length % 2; i += 1) 
	// 	{
	// 		str += "0"; 
	// 	}
	// 	str += a;
	// 	String.fromCharCode(parseInt(str, 16));
	// 	//return ('0' * (a.length % 2) + a).decode('hex')[::-1];
		// return str.split("").reverse().join("")
	// }
}

function decode_int(s)
{
	// changed from s.reverse().encode('hex') to s.reverse()
	if (s == '')
	{
		return 0;
	}
	else
	{
		return parseInt(s.split("").reverse().join(""), 16);
	}
}

// convert to js equivalents
function zpad(s, length)
{
    //return s + '\x00' * Math.max(0, length - s.length);
    return s + Array(Math.max(0, length - s.length) + 1).join('\x00') 
}

// convert to js equivalents
function serialize_hash(h)
{
    str = "";
    for (var i = 0; i < h.length; i++)
    {
    	console.log(h[i]);
		str +=	zpad(encode_int(h[i]), 4);
		console.log(str.length);
    }
    
    return str;
}

  
function deserialize_hash(h)
{
	var deserialized_hash = new Array();
	for (var i = 0; i < h.length; i+= WORD_BYTES)
	{
		deserialized_hash.push(decode_int(h.slice(i,i+WORD_BYTES)));
	}
    return deserialized_hash;
}

// convert to js equivalents
function fnv(v1, v2)
{
    return ((v1 * FNV_PRIME) ^ v2) % 2**32;
}

function hash_words(h, sz, x)
{
	console.log("inside hash_words");
    if (Array.isArray(x))
    {
    	console.log("serializing array",x);
        x = serialize_hash(x);
    }
    y = h(x);
    console.log("deserialized hash");
    return deserialize_hash(y);
}

function sha3_512(x)
{
    return hash_words(function h(v)
    	{
    		return Sha3.hash512(v);
    	}, 64, x);
}

function sha3_256(x)
{
    return hash_words(function h(v)
    	{
    		return Sha3.hash256(v);
    	}, 32, x);
}