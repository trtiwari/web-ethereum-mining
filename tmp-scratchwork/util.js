// util.js
// Tim Hughes <tim@twistedfury.com>

/*jslint node: true, shadow:true */
"use strict";

class Util{

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

static serializeIterableObject(iterable) {
	var returnVal = new Array(iterable.length)
	const iterableIterator = iterable.values();
	for (var i = 0; i < iterable.length; i++) {
		returnVal[i] = iterableIterator.next().value;
	}
	return returnVal;
}

/*

A function to calculate the approximate memory usage of objects

Created by Kate Morley - http://code.iamkate.com/ - and released under the terms
of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

/* Returns the approximate memory usage, in bytes, of the specified object. The
 * parameter is:
 *
 * object - the object whose size should be determined
 */

/*
static sizeof(object){

  // initialise the list of objects and size
  var objects = [object];
  var size    = 0;

  // loop over the objects
  for (var index = 0; index < objects.length; index ++){

    // determine the type of the object
    switch (typeof objects[index]){

      // the object is a boolean
      case 'boolean': size += 4; break;

      // the object is a number
      case 'number': size += 8; break;

      // the object is a string
      case 'string': size += 2 * objects[index].length; break;

      // the object is a generic object
      case 'object':

        // if the object is not an array, add the sizes of the keys
        if (Object.prototype.toString.call(objects[index]) != '[object Array]'){
          for (var key in objects[index]) size += 2 * key.length;
        }

        // loop over the keys
        for (var key in objects[index]){

          // determine whether the value has already been processed
          var processed = false;
          for (var search = 0; search < objects.length; search ++){
            if (objects[search] === objects[index][key]){
              processed = true;
              break;
            }
          }

          // queue the value to be processed if appropriate
          if (!processed) objects.push(objects[index][key]);

        }

    }

  }

  // return the calculated size
  return size;

}
*/

}