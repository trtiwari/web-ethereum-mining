// ethash.js
// Tim Hughes <tim@twistedfury.com>
// Revision 19


"use strict";

// we save some values of in this dag object

var NUM_DAG_SLICES = 10000000;
var hashWords = 16;
var dag = new Uint32Array(NUM_DAG_SLICES*hashWords);
var cacheHits = 0;
var numAccesses = 0;

function store(dagArray,startIndex,endIndex)
{
		var start = startIndex * hashWords;
		var end = endIndex * hashWords;
		if (start > dag.length)
			return;
		if (end > dag.length) 
			end = dag.length;
		for (var i = start; i < end; i = i +16)
		{
			for (var j = 0; j < 16; j++)
			{
				dag[i+j] = dagArray[i+j-start]; // offset by start
			}
		}
}

function cacheComputeSliceStore(nodeIndex,node) 
{
	var index = nodeIndex * hashWords;
	if (index + 16 >= dag.length) 
		return;
	for (var j = 0; j < 16; j++)
	{
		dag[index+j] = node[j];
	}
}

function DAGLookup(index) 
{
	var i = index*hashWords;
	var j = i + hashWords;
	var present = false;
	// check if the slice is all 0s.

	// since we allocated a huge array, arr.slice(i,j) will almost always return
	// a slice -- even if the slice hasn't been filled up with a dag node yet
	// So we must explicitly check for all 0s in a slice, and return null if so.
	if (j >= dag.length)
	{
		return null;
	}
	for (var w = 0; w < 16; w++)
	{
		if (dag[i+w] !== 0)
		{
			present = true;
		}
	}
	if (!present)
	{
		return null;
	}
	return dag.slice(i,j);
}

// 32-bit unsigned modulo
function mod32(x, n)
{
	return (x>>>0) % (n>>>0);
}

function fnv(x, y)
{
	// js integer multiply by 0x01000193 will lose precision
	return ((x*0x01000000 | 0) + (x*0x193 | 0)) ^ y;	
}

function computeCache(params, seedWords)
{
	var cache = new Uint32Array(params.cacheSize >> 2);
	var cacheNodeCount = params.cacheSize >> 6;

	// Initialize cache
	var keccak = new Keccak();
	keccak.digestWords(cache, 0, 16, seedWords, 0, seedWords.length);
	for (var n = 1; n < cacheNodeCount; ++n)
	{
		keccak.digestWords(cache, n<<4, 16, cache, (n-1)<<4, 16);
	}
	
	var tmp = new Uint32Array(16);
	
	// Do randmemohash passes
	for (var r = 0; r < params.cacheRounds; ++r)
	{
		for (var n = 0; n < cacheNodeCount; ++n)
		{
			var p0 = mod32(n + cacheNodeCount - 1, cacheNodeCount) << 4;
			var p1 = mod32(cache[n<<4|0], cacheNodeCount) << 4;
			
			for (var w = 0; w < 16; w=(w+1)|0)
			{
				tmp[w] = cache[p0 | w] ^ cache[p1 | w];
			}
			
			keccak.digestWords(cache, n<<4, 16, tmp, 0, tmp.length);
		}
	}
	return cache;
}

function computeDagNode(o_node, params, cache, keccak, nodeIndex)
{
	var cacheNodeCount = params.cacheSize >> 6;
	var dagParents = params.dagParents;
	
	var c = (nodeIndex % cacheNodeCount) << 4;
	var mix = o_node;
	for (var w = 0; w < 16; ++w)
	{
		mix[w] = cache[c|w];
	}
	mix[0] ^= nodeIndex;
	keccak.digestWords(mix, 0, 16, mix, 0, 16);
	
	for (var p = 0; p < dagParents; ++p)
	{
		// compute cache node (word) index
		c = mod32(fnv(nodeIndex ^ p, mix[p&15]), cacheNodeCount) << 4;
		
		for (var w = 0; w < 16; ++w)
		{
			mix[w] = fnv(mix[w], cache[c|w]);
		}
	}
	
	keccak.digestWords(mix, 0, 16, mix, 0, 16);

	// saving the computed dag slice 
	cacheComputeSliceStore(nodeIndex,o_node);
}

function computeHashInner(mix, params, cache, keccak, tempNode)
{
	var mixParents = params.mixParents|0;
	var mixWordCount = params.mixSize >> 2;
	var mixNodeCount = mixWordCount >> 4;
	// hardcoding to 32 (hashwords * 2)
	var dagPageCount = (params.dagSize / 32)>>0;//params.mixSize) >> 0;
	
	// grab initial first word
	var s0 = mix[0];
	
	// initialise mix from initial 64 bytes
	for (var w = 16; w < mixWordCount; ++w)
	{
		mix[w] = mix[w & 15];
	}
	
	for (var a = 0; a < mixParents; ++a)
	{
		var p = mod32(fnv(s0 ^ a, mix[a & (mixWordCount-1)]), dagPageCount);
		var d = (p * mixNodeCount)|0;
		
		for (var n = 0, w = 0; n < mixNodeCount; ++n, w += 16)
		{
			// modded to check for already present value of dag node
			numAccesses = numAccesses + 1;
			if (DAGLookup((d + n)|0) != null)
			{
				cacheHits = cacheHits + 1;
				tempNode = DAGLookup((d + n)|0);
			}
			else 
			{
				// console.log((d + n)|0);
				computeDagNode(tempNode, params, cache, keccak, (d + n)|0);
			}
			
			for (var v = 0; v < 16; ++v)
			{
				mix[w|v] = fnv(mix[w|v], tempNode[v]);
			}
		}
	}
}

function convertSeed(seed)
{
	// todo, reconcile with spec, byte ordering?
	// todo, big-endian conversion
	var newSeed = Util.toWords(seed);
	if (newSeed === null)
		throw Error("Invalid seed '" + seed + "'");
	return newSeed;
}

function defaultParams(cacheLen=1048384,dagLen=1073739904)
{
	return {
		cacheSize: cacheLen,
		cacheRounds: 3,
		dagSize: dagLen,
		dagParents: 256,
		mixSize: 128,
		mixParents: 64,
	};
}

class Ethash
{
	constructor(params,cache,dagArray,startIndex,endIndex)
	{
		this.params = params;
		// this.seed = convertSeed(seed);
		this.cache = cache;//computeCache(params, seed);
	
		// preallocate buffers/etc
		this.initBuf = new ArrayBuffer(96);
		this.initBytes = new Uint8Array(this.initBuf);
		// this.initBytes = new Array(this.initBuf);
		this.initWords = new Uint32Array(this.initBuf);
		this.mixWords = new Uint32Array(this.params.mixSize / 4);
		this.tempNode = new Uint32Array(16);
		this.keccak = new Keccak();
		
		this.retWords = new Uint32Array(8);
		this.retBytes = new Uint8Array(this.retWords.buffer); // supposedly read-only
		if (startIndex != endIndex)
		{
			store(dagArray,startIndex,endIndex);
		}
	}
	// precompute cache and related values
	
	
	hash(header, nonce)
	{
		// compute initial hash
		this.initBytes.set(header, 0);
		// console.log("checkpoint 0: " + this.initWords);
		this.initBytes.set(nonce, 32);

		console.log("checkpoint 1: " + this.initWords);
		// console.log(this.initWords.length);
		// console.log("nonce.length/4: "+ nonce.length/4);

		this.keccak.digestWords(this.initWords, 0, 16, this.initWords, 0, 8 + nonce.length/4);
		
		// compute mix
		for (let i = 0; i != 16; ++i)
		{
			this.mixWords[i] = this.initWords[i];
		}

		console.log("checkpoint 2: " + this.mixWords);
		// console.log(this.mixWords.length);
		computeHashInner(this.mixWords, this.params, this.cache, this.keccak, this.tempNode);
		console.log("checkpoint 3a: " + this.mixWords);
		console.log("checkpoint 3b: " + this.tempNode);
		
		// compress mix and append to initWords
		for (let i = 0; i != this.mixWords.length; i += 4)
		{
			this.initWords[16 + i/4] = fnv(fnv(fnv(this.mixWords[i], this.mixWords[i+1]), this.mixWords[i+2]), this.mixWords[i+3]);
		}
			
		// final keccak hashes
		this.keccak.digestWords(this.retWords, 0, 8, this.initWords, 0, 24); // keccak-256(s + cmix)
		// return [this.initBytes,this.retBytes];
		// CHANGE BACK TO RETBYTES!!
		return this.retWords;
	};
	
	cacheDigest()
	{
		return this.keccak.digest(32, new Uint8Array(this.cache.buffer));
	};
};




