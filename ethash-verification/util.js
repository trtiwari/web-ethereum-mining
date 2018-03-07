// util.js
// Tim Hughes <tim@twistedfury.com>

/*jslint node: true, shadow:true */
"use strict";

class Util {
	static nibbleToChar(nibble)
	{
		return String.fromCharCode((nibble < 10 ? 48 : 87) + nibble);
	}

	static charToNibble(chr)
	{
		if (chr >= 48 && chr <= 57)
		{
			return chr - 48;
		}
		if (chr >= 65 && chr <= 70)
		{
			return chr - 65 + 10;
		}
		if (chr >= 97 && chr <= 102)
		{
			return chr - 97 + 10;
		}
		return 0;
	}

	static stringToBytes(str)
	{
		var bytes = new Uint8Array(str.length);
		for (var i = 0; i != str.length; ++i)
		{
			bytes[i] = str.charCodeAt(i);
		}
		return bytes;
	}

	static hexStringToBytes(str)
	{
		var bytes = new Uint8Array(str.length>>>1);
		for (var i = 0; i != bytes.length; ++i)
		{
			bytes[i] = Util.charToNibble(str.charCodeAt(i<<1 | 0)) << 4;
			bytes[i] |= Util.charToNibble(str.charCodeAt(i<<1 | 1));
		}
		return bytes;
	}

	static bytesToHexString(bytes)
	{
		var str = "";
		for (var i = 0; i != bytes.length; ++i)
		{
			str += Util.nibbleToChar(bytes[i] >>> 4);
			str += Util.nibbleToChar(bytes[i] & 0xf);
		}
		return str;
	}

	static wordsToHexString(words)
	{
		return Util.bytesToHexString(new Uint8Array(words.buffer));
	}

	static uint32ToHexString(num)
	{
		var buf = new Uint8Array(4);
		buf[0] = (num >> 24) & 0xff;
		buf[1] = (num >> 16) & 0xff;
		buf[2] = (num >> 8) & 0xff;
		buf[3] = (num >> 0) & 0xff;
		return Util.bytesToHexString(buf);
	}

	static toWords(input)
	{
		if (input instanceof Uint32Array)
		{
			return input;
		}
		else if (input instanceof Uint8Array)
		{
			var tmp = new Uint8Array((input.length + 3) & ~3);
			tmp.set(input);
			return new Uint32Array(tmp.buffer);
		}
		else if (typeof input === typeof "")
		{
			return Util.toWords(stringToBytes(input));
		}
		return null;
	}

	static longToByteArray(long) {
    	// we want to represent the input as a 8-bytes array
	    var byteArray = new Uint8Array(8);

	    for ( var index = 0; index < byteArray.length; index ++ ) {
	        var byte = long & 0xff;
	        byteArray [ index ] = byte;
	        long = (long - byte) / 256 ;
	    }

    return byteArray;
	}

	static byteArrayToLong(byteArray) {
	    var value = 0;
	    for ( var i = byteArray.length - 1; i >= 0; i--) {
	        value = (value * 256) + byteArray[i];
	    }

	    return value;
	}

}
// exports.stringToBytes = stringToBytes;
// exports.hexStringToBytes = hexStringToBytes;
// exports.bytesToHexString = bytesToHexString;
// exports.wordsToHexString = wordsToHexString;
// exports.uint32ToHexString = uint32ToHexString;
// exports.toWords = toWords;