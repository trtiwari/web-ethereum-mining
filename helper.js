var FNV_PRIME = 0x01000193;

function encode_int(s)
{
	// convert format string to js equivalents
	a = "%x" % s
	if (s == 0)
	{
		return '';
	}
	else
	{
		return ('0' * (a.length % 2) + a).decode('hex')[::-1];
	}
}

// convert to js equivalents
function zpad(s, length)
{
    return s + '\x00' * Math.max(0, length - s.length);
}

// convert to js equivalents
function serialize_hash(h)
{
    return ''.join([zpad(encode_int(x), 4) for x in h]);
}

// convert to js equivalents
function fnv(v1, v2)
{
    return ((v1 * FNV_PRIME) ^ v2) % 2**32;
}
