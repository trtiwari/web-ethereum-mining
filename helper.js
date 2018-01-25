var FNV_PRIME = 0x01000193;

function encode_int(s)
{
	// convert format string to js equivalents
	//a = "%x" % s
	a = s.toString(16)
	if (s == 0)
	{
		return '';
	}
	else
	{	
		hex = Array(a.length % 2 + 1).join('0') + a
		for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		//return ('0' * (a.length % 2) + a).decode('hex')[::-1];
		return str.split("").reverse().join("")
	}
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
		return parseInt(s.reverse(), 16);
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
    str = ""
    for (x in h)
    {
		str +=	zpad(encode_int(x), 4)
    }
    
    return str
}

  
function deserialize_hash(h)
{
	// FIXXXXX
    return [decode_int(h[i:i+WORD_BYTES]) for i in range(0, len(h), WORD_BYTES)];
}

// convert to js equivalents
function fnv(v1, v2)
{
    return ((v1 * FNV_PRIME) ^ v2) % 2**32;
}

function hash_words(h, sz, x)
{
    if (Array.isArray(x))
    {
        x = serialize_hash(x);
    }
    y = h(x);
    return deserialize_hash(y);
}

function sha3_512(x)
{
    return hash_words(function h(v)
    	{
    		Sha3.hash512(v).digest()
    	}, 64, x);
}

function sha3_256(x)
{
    return hash_words(function h(v)
    	{
    		Sha3.hash256(v).digest()
    	}, 32, x);
}