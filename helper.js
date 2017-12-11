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
    // console.log("Array length");
    // console.log(h.length);
    for (x in h)
    {
		str +=	zpad(encode_int(x), 4)
    }
    // console.log("hashed input to str: " + str);
    //return ''.join([zpad(encode_int(x), 4) for x in h]);
    return str
}

// convert to js equivalents
function fnv(v1, v2)
{
    return ((v1 * FNV_PRIME) ^ v2) % 2**32;
}
