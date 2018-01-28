var ethashParams = defaultParams();
//ethashParams.cacheRounds = 0;

// create hasher
var seed = Util.hexStringToBytes("9410b944535a83d9adf6bbdcc80e051f30676173c16ca0d32d6f1263fc246466")
var startTime = new Date().getTime();
var hasher = new Ethash(ethashParams, seed);
console.log('Ethash startup took: '+(new Date().getTime() - startTime) + "ms");
console.log('Ethash cache hash: ' + Util.bytesToHexString(hasher.cacheDigest()));


var header = Util.hexStringToBytes("c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");
var nonce = Util.hexStringToBytes("0000000000000000");
var hash;

startTime = new Date().getTime();
var trials = 10;
for (var i = 0; i < trials; ++i)
{
	hash = hasher.hash(header, nonce);
}
console.log("Light client hashes averaged: " + (new Date().getTime() - startTime)/trials + "ms");
console.log("Hash = " + Util.bytesToHexString(hash));