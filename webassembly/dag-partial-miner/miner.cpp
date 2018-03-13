#include <emscripten/bind.h>
#include <string.h>
#include <math.h>
#include <sstream>
#include <chrono>
#include <cstdlib>
// #include<iostream>
using namespace emscripten;

unsigned int * dag;
unsigned int numSlicesLocal = 100;
unsigned int startIndex;
unsigned int cacheHit = 0;
unsigned int numAccesses = 0;

class Params
{
	public:
		unsigned int cacheSize;
		unsigned int cacheRounds;
		unsigned int dagSize;
		unsigned int dagParents;
		unsigned int mixSize;
		unsigned int mixParents;

		Params()
		{
			this->cacheSize = 1048384;
			this->cacheRounds = 3;
			this->dagSize = 1073739904;
			this->dagParents = 256;
			this->mixSize = 128;
			this->mixParents = 64;
		}

		Params(unsigned int cacheSize,unsigned int dagSize)
		{
			this->cacheSize = cacheSize;
			this->cacheRounds = 3;
			this->dagSize = dagSize;
			this->dagParents = 256;
			this->mixSize = 128;
			this->mixParents = 64;
		}
};

unsigned int Keccak_f1600_Rho[] = {
	1,  3,  6,  10, 15, 21, 28, 36, 45, 55, 2,  14, 
	27, 41, 56, 8,  25, 43, 62, 18, 39, 61, 20, 44
};

unsigned int Keccak_f1600_Pi[]= {
	10, 7,  11, 17, 18, 3, 5,  16, 8,  21, 24, 4, 
	15, 23, 19, 13, 12, 2, 20, 14, 22, 9,  6,  1 
};

unsigned int Keccak_f1600_RC[] = { 
	0x00000001, 0x00000000,
	0x00008082, 0x00000000,
	0x0000808a, 0x80000000,
	0x80008000, 0x80000000,
	0x0000808b, 0x00000000,
	0x80000001, 0x00000000,
	0x80008081, 0x80000000,
	0x00008009, 0x80000000,
	0x0000008a, 0x00000000,
	0x00000088, 0x00000000,
	0x80008009, 0x00000000,
	0x8000000a, 0x00000000,
	0x8000808b, 0x00000000,
	0x0000008b, 0x80000000,
	0x00008089, 0x80000000,
	0x00008003, 0x80000000,
	0x00008002, 0x80000000,
	0x00000080, 0x80000000,
	0x0000800a, 0x00000000,
	0x8000000a, 0x80000000,
	0x80008081, 0x80000000,
	0x00008080, 0x80000000,
	0x80000001, 0x00000000,
	0x80008008, 0x80000000,
};

void keccak_f1600(unsigned int * outState, unsigned int outOffset, unsigned int outSize, unsigned int * inState)
{
	// todo, handle big endian loads
	unsigned int a00l = inState[0]|0;
	unsigned int a00h = inState[1]|0;
	unsigned int a01l = inState[2]|0;
	unsigned int a01h = inState[3]|0;
	unsigned int a02l = inState[4]|0;
	unsigned int a02h = inState[5]|0;
	unsigned int a03l = inState[6]|0;
	unsigned int a03h = inState[7]|0;
	unsigned int a04l = inState[8]|0;
	unsigned int a04h = inState[9]|0;
	unsigned int a05l = inState[10]|0;
	unsigned int a05h = inState[11]|0;
	unsigned int a06l = inState[12]|0;
	unsigned int a06h = inState[13]|0;
	unsigned int a07l = inState[14]|0;
	unsigned int a07h = inState[15]|0;
	unsigned int a08l = inState[16]|0;
	unsigned int a08h = inState[17]|0;
	unsigned int a09l = inState[18]|0;
	unsigned int a09h = inState[19]|0;
	unsigned int a10l = inState[20]|0;
	unsigned int a10h = inState[21]|0;
	unsigned int a11l = inState[22]|0;
	unsigned int a11h = inState[23]|0;
	unsigned int a12l = inState[24]|0;
	unsigned int a12h = inState[25]|0;
	unsigned int a13l = inState[26]|0;
	unsigned int a13h = inState[27]|0;
	unsigned int a14l = inState[28]|0;
	unsigned int a14h = inState[29]|0;
	unsigned int a15l = inState[30]|0;
	unsigned int a15h = inState[31]|0;
	unsigned int a16l = inState[32]|0;
	unsigned int a16h = inState[33]|0;
	unsigned int a17l = inState[34]|0;
	unsigned int a17h = inState[35]|0;
	unsigned int a18l = inState[36]|0;
	unsigned int a18h = inState[37]|0;
	unsigned int a19l = inState[38]|0;
	unsigned int a19h = inState[39]|0;
	unsigned int a20l = inState[40]|0;
	unsigned int a20h = inState[41]|0;
	unsigned int a21l = inState[42]|0;
	unsigned int a21h = inState[43]|0;
	unsigned int a22l = inState[44]|0;
	unsigned int a22h = inState[45]|0;
	unsigned int a23l = inState[46]|0;
	unsigned int a23h = inState[47]|0;
	unsigned int a24l = inState[48]|0;
	unsigned int a24h = inState[49]|0;
	unsigned int b00l, b00h, b01l, b01h, b02l, b02h, b03l, b03h, b04l, b04h;
	unsigned int b05l, b05h, b06l, b06h, b07l, b07h, b08l, b08h, b09l, b09h;
	unsigned int b10l, b10h, b11l, b11h, b12l, b12h, b13l, b13h, b14l, b14h;
	unsigned int b15l, b15h, b16l, b16h, b17l, b17h, b18l, b18h, b19l, b19h;
	unsigned int b20l, b20h, b21l, b21h, b22l, b22h, b23l, b23h, b24l, b24h;
	unsigned int tl, nl;
	unsigned int th, nh;

	for (unsigned int r = 0; r < 48; r = (r+2)|0)
	{
		// Theta
		b00l = a00l ^ a05l ^ a10l ^ a15l ^ a20l;
		b00h = a00h ^ a05h ^ a10h ^ a15h ^ a20h;
		b01l = a01l ^ a06l ^ a11l ^ a16l ^ a21l;
		b01h = a01h ^ a06h ^ a11h ^ a16h ^ a21h;
		b02l = a02l ^ a07l ^ a12l ^ a17l ^ a22l;
		b02h = a02h ^ a07h ^ a12h ^ a17h ^ a22h;
		b03l = a03l ^ a08l ^ a13l ^ a18l ^ a23l;
		b03h = a03h ^ a08h ^ a13h ^ a18h ^ a23h;
		b04l = a04l ^ a09l ^ a14l ^ a19l ^ a24l;
		b04h = a04h ^ a09h ^ a14h ^ a19h ^ a24h;
		tl = b04l ^ (b01l << 1 | b01h >> 31);
		th = b04h ^ (b01h << 1 | b01l >> 31);
		a00l ^= tl;
		a00h ^= th;
		a05l ^= tl;
		a05h ^= th;
		a10l ^= tl;
		a10h ^= th;
		a15l ^= tl;
		a15h ^= th;
		a20l ^= tl;
		a20h ^= th;
		tl = b00l ^ (b02l << 1 | b02h >> 31);
		th = b00h ^ (b02h << 1 | b02l >> 31);
		a01l ^= tl;
		a01h ^= th;
		a06l ^= tl;
		a06h ^= th;
		a11l ^= tl;
		a11h ^= th;
		a16l ^= tl;
		a16h ^= th;
		a21l ^= tl;
		a21h ^= th;
		tl = b01l ^ (b03l << 1 | b03h >> 31);
		th = b01h ^ (b03h << 1 | b03l >> 31);
		a02l ^= tl;
		a02h ^= th;
		a07l ^= tl;
		a07h ^= th;
		a12l ^= tl;
		a12h ^= th;
		a17l ^= tl;
		a17h ^= th;
		a22l ^= tl;
		a22h ^= th;
		tl = b02l ^ (b04l << 1 | b04h >> 31);
		th = b02h ^ (b04h << 1 | b04l >> 31);
		a03l ^= tl;
		a03h ^= th;
		a08l ^= tl;
		a08h ^= th;
		a13l ^= tl;
		a13h ^= th;
		a18l ^= tl;
		a18h ^= th;
		a23l ^= tl;
		a23h ^= th;
		tl = b03l ^ (b00l << 1 | b00h >> 31);
		th = b03h ^ (b00h << 1 | b00l >> 31);
		a04l ^= tl;
		a04h ^= th;
		a09l ^= tl;
		a09h ^= th;
		a14l ^= tl;
		a14h ^= th;
		a19l ^= tl;
		a19h ^= th;
		a24l ^= tl;
		a24h ^= th;

		// Rho Pi
		b00l = a00l;
		b00h = a00h;
		b10l = a01l << 1 | a01h >> 31;
		b10h = a01h << 1 | a01l >> 31;
		b07l = a10l << 3 | a10h >> 29;
		b07h = a10h << 3 | a10l >> 29;
		b11l = a07l << 6 | a07h >> 26;
		b11h = a07h << 6 | a07l >> 26;
		b17l = a11l << 10 | a11h >> 22;
		b17h = a11h << 10 | a11l >> 22;
		b18l = a17l << 15 | a17h >> 17;
		b18h = a17h << 15 | a17l >> 17;
		b03l = a18l << 21 | a18h >> 11;
		b03h = a18h << 21 | a18l >> 11;
		b05l = a03l << 28 | a03h >> 4;
		b05h = a03h << 28 | a03l >> 4;
		b16l = a05h << 4 | a05l >> 28;
		b16h = a05l << 4 | a05h >> 28;
		b08l = a16h << 13 | a16l >> 19;
		b08h = a16l << 13 | a16h >> 19;
		b21l = a08h << 23 | a08l >> 9;
		b21h = a08l << 23 | a08h >> 9;
		b24l = a21l << 2 | a21h >> 30;
		b24h = a21h << 2 | a21l >> 30;
		b04l = a24l << 14 | a24h >> 18;
		b04h = a24h << 14 | a24l >> 18;
		b15l = a04l << 27 | a04h >> 5;
		b15h = a04h << 27 | a04l >> 5;
		b23l = a15h << 9 | a15l >> 23;
		b23h = a15l << 9 | a15h >> 23;
		b19l = a23h << 24 | a23l >> 8;
		b19h = a23l << 24 | a23h >> 8;
		b13l = a19l << 8 | a19h >> 24;
		b13h = a19h << 8 | a19l >> 24;
		b12l = a13l << 25 | a13h >> 7;
		b12h = a13h << 25 | a13l >> 7;
		b02l = a12h << 11 | a12l >> 21;
		b02h = a12l << 11 | a12h >> 21;
		b20l = a02h << 30 | a02l >> 2;
		b20h = a02l << 30 | a02h >> 2;
		b14l = a20l << 18 | a20h >> 14;
		b14h = a20h << 18 | a20l >> 14;
		b22l = a14h << 7 | a14l >> 25;
		b22h = a14l << 7 | a14h >> 25;
		b09l = a22h << 29 | a22l >> 3;
		b09h = a22l << 29 | a22h >> 3;
		b06l = a09l << 20 | a09h >> 12;
		b06h = a09h << 20 | a09l >> 12;
		b01l = a06h << 12 | a06l >> 20;
		b01h = a06l << 12 | a06h >> 20;

		// Chi
		a00l = b00l ^ ~b01l & b02l;
		a00h = b00h ^ ~b01h & b02h;
		a01l = b01l ^ ~b02l & b03l;
		a01h = b01h ^ ~b02h & b03h;
		a02l = b02l ^ ~b03l & b04l;
		a02h = b02h ^ ~b03h & b04h;
		a03l = b03l ^ ~b04l & b00l;
		a03h = b03h ^ ~b04h & b00h;
		a04l = b04l ^ ~b00l & b01l;
		a04h = b04h ^ ~b00h & b01h;
		a05l = b05l ^ ~b06l & b07l;
		a05h = b05h ^ ~b06h & b07h;
		a06l = b06l ^ ~b07l & b08l;
		a06h = b06h ^ ~b07h & b08h;
		a07l = b07l ^ ~b08l & b09l;
		a07h = b07h ^ ~b08h & b09h;
		a08l = b08l ^ ~b09l & b05l;
		a08h = b08h ^ ~b09h & b05h;
		a09l = b09l ^ ~b05l & b06l;
		a09h = b09h ^ ~b05h & b06h;
		a10l = b10l ^ ~b11l & b12l;
		a10h = b10h ^ ~b11h & b12h;
		a11l = b11l ^ ~b12l & b13l;
		a11h = b11h ^ ~b12h & b13h;
		a12l = b12l ^ ~b13l & b14l;
		a12h = b12h ^ ~b13h & b14h;
		a13l = b13l ^ ~b14l & b10l;
		a13h = b13h ^ ~b14h & b10h;
		a14l = b14l ^ ~b10l & b11l;
		a14h = b14h ^ ~b10h & b11h;
		a15l = b15l ^ ~b16l & b17l;
		a15h = b15h ^ ~b16h & b17h;
		a16l = b16l ^ ~b17l & b18l;
		a16h = b16h ^ ~b17h & b18h;
		a17l = b17l ^ ~b18l & b19l;
		a17h = b17h ^ ~b18h & b19h;
		a18l = b18l ^ ~b19l & b15l;
		a18h = b18h ^ ~b19h & b15h;
		a19l = b19l ^ ~b15l & b16l;
		a19h = b19h ^ ~b15h & b16h;
		a20l = b20l ^ ~b21l & b22l;
		a20h = b20h ^ ~b21h & b22h;
		a21l = b21l ^ ~b22l & b23l;
		a21h = b21h ^ ~b22h & b23h;
		a22l = b22l ^ ~b23l & b24l;
		a22h = b22h ^ ~b23h & b24h;
		a23l = b23l ^ ~b24l & b20l;
		a23h = b23h ^ ~b24h & b20h;
		a24l = b24l ^ ~b20l & b21l;
		a24h = b24h ^ ~b20h & b21h;

		// Iota
		a00l = Keccak_f1600_RC[r|0] ^ a00l;
		a00h = Keccak_f1600_RC[r|1] ^ a00h;
	}
	
	// todo, handle big-endian stores
	outState[outOffset|0] = a00l;
	outState[outOffset|1] = a00h;
	outState[outOffset|2] = a01l;
	outState[outOffset|3] = a01h;
	outState[outOffset|4] = a02l;
	outState[outOffset|5] = a02h;
	outState[outOffset|6] = a03l;
	outState[outOffset|7] = a03h;
	if (outSize == 8)
		return;
	outState[outOffset|8] = a04l;
	outState[outOffset|9] = a04h;
	outState[outOffset|10] = a05l;
	outState[outOffset|11] = a05h;
	outState[outOffset|12] = a06l;
	outState[outOffset|13] = a06h;
	outState[outOffset|14] = a07l;
	outState[outOffset|15] = a07h;
	if (outSize == 16)
		return;
	outState[outOffset|16] = a08l;
	outState[outOffset|17] = a08h;
	outState[outOffset|18] = a09l;
	outState[outOffset|19] = a09h;
	outState[outOffset|20] = a10l;
	outState[outOffset|21] = a10h;
	outState[outOffset|22] = a11l;
	outState[outOffset|23] = a11h;
	outState[outOffset|24] = a12l;
	outState[outOffset|25] = a12h;
	outState[outOffset|26] = a13l;
	outState[outOffset|27] = a13h;
	outState[outOffset|28] = a14l;
	outState[outOffset|29] = a14h;
	outState[outOffset|30] = a15l;
	outState[outOffset|31] = a15h;
	outState[outOffset|32] = a16l;
	outState[outOffset|33] = a16h;
	outState[outOffset|34] = a17l;
	outState[outOffset|35] = a17h;
	outState[outOffset|36] = a18l;
	outState[outOffset|37] = a18h;
	outState[outOffset|38] = a19l;
	outState[outOffset|39] = a19h;
	outState[outOffset|40] = a20l;
	outState[outOffset|41] = a20h;
	outState[outOffset|42] = a21l;
	outState[outOffset|43] = a21h;
	outState[outOffset|44] = a22l;
	outState[outOffset|45] = a22h;
	outState[outOffset|46] = a23l;
	outState[outOffset|47] = a23h;
	outState[outOffset|48] = a24l;
	outState[outOffset|49] = a24h;
}

class Keccak
{
	public:
		// changed stateBuf from uchar to uint
		unsigned int stateBuf[200];
		unsigned int  * stateWords;
		Keccak()
		{
			// got rid of stateBytes
			// don't need 2 datastructures pointing to the same object
			this->stateWords = this->stateBuf;
		}
		
		void digestWords(unsigned int * oWords, unsigned int oOffset, unsigned int oLength, unsigned int * iWords, unsigned int iOffset, unsigned int iLength)
		{
			for (unsigned int i = 0; i < 50; ++i)
			{
				this->stateWords[i] = 0;
			}
			
			unsigned int r = 50 - oLength*2;
			for (;;)
			{
				unsigned int len = iLength < r ? iLength : r;
				for (unsigned int i = 0; i < len; ++i, ++iOffset)
				{
					this->stateWords[i] ^= iWords[iOffset];
				}
				
				if (iLength < r)
					break;
				iLength -= len;
				
				keccak_f1600(this->stateWords, 0, 50, this->stateWords);
			}
			
			// these both were stateBytes instead of stateWords, but type inconsistency
			// is not allowed is c++, so changed
			this->stateWords[iLength<<2] ^= 1;
			this->stateWords[(r<<2) - 1] ^= 0x80;
			keccak_f1600(oWords, oOffset, oLength, this->stateWords);
		}
};

// FIX -- only works for ascii, not for the entire range of utf-16
char nibbleToChar(char nibble)
{
	return (nibble < 10 ? 48 : 87) + nibble + '0';
}

unsigned int charToNibble(unsigned int chr)
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

void store(std::string dagStr)
{
		std::stringstream ss(dagStr);
		for (unsigned int i = 0; i < numSlicesLocal*16; i = i++)
		{
			ss >> dag[i];
		}
}

unsigned int * DAGLookup(unsigned int index) 
{
	unsigned int i = (index - startIndex)*16;
	if (i+16 >= numSlicesLocal*16) 
	{
		return NULL;
	}
	return &dag[i];
}

unsigned int fnv(unsigned int x, unsigned int y)
{
	// js integer multiply by 0x01000193 will lose precision
	return x*0x01000193 ^ y;
}


void computeDagNode(unsigned int * o_node, Params * params, unsigned int * cache, Keccak * keccak, unsigned int nodeIndex)
{
	unsigned int cacheNodeCount = params->cacheSize >> 6;
	unsigned int dagParents = params->dagParents;
	
	unsigned int c = (nodeIndex % cacheNodeCount) << 4;
	unsigned int * mix = o_node;

	for (unsigned int w = 0; w < 16; ++w)
	{
		// FIX THIS -- c|w is too big -- cast to uchar as temp hack
		// the original go implementation does it differently than this
		// maybe this is a bug in the official ethash repo?
		mix[w] = cache[c|w];
	}	

	mix[0] ^= nodeIndex;

	keccak->digestWords(mix, 0, 16, mix, 0, 16);

	for (unsigned int p = 0; p < dagParents; ++p)
	{
		// compute cache node (word) index
		c = (fnv(nodeIndex ^ p, mix[p&15]) % cacheNodeCount) << 4;
		for (unsigned int w = 0; w < 16; ++w)
		{
			// FIX THIS -- c|w is too big -- cast to uchar as temp hack
			// the original go implementation does it differently than this
			// maybe this is a bug in the official ethash repo?
			// std::cout << ((unsigned short) c+w) << std::endl;
			mix[w] = fnv(mix[w], cache[c|w]);
		}
	}
	
	keccak->digestWords(mix, 0, 16, mix, 0, 16);
}

void computeHashInner(unsigned int * mix, Params * params,unsigned int * cache, Keccak * keccak,unsigned int * tempNode)
{
	unsigned int mixParents = params->mixParents;
	unsigned int mixWordCount = params->mixSize >> 2;
	unsigned int mixNodeCount = mixWordCount >> 4;
	unsigned int dagPageCount = params->dagSize /32;// params->mixSize) >> 0;
	
	// grab initial first word
	unsigned int s0 = mix[0];
	
	// initialise mix from initial 64 bytes
	for (unsigned int w = 16; w < mixWordCount; ++w)
	{
		mix[w] = mix[w & 15];
	}

	for (unsigned int a = 0; a < mixParents; ++a)
	{
		unsigned int p = mod32(fnv(s0 ^ a, mix[a & (mixWordCount-1)]), dagPageCount);
		unsigned int d = p * mixNodeCount;
		for (unsigned int n = 0, w = 0; n < mixNodeCount; ++n, w = w + 16)
		{
			numAccesses++;
			if (DAGLookup(d + n) != NULL)
			{
				cacheHit++;
				tempNode = DAGLookup(d + n);
			}
			else 
			{
				computeDagNode(tempNode, params, cache, keccak, d + n);
			}
			
			for (unsigned int v = 0; v < 16; ++v)
			{
				mix[w|v] = fnv(mix[w|v], tempNode[v]);
			}
		}
	}
}

class Ethash
{
	public:
		Params * params;
		unsigned int * cache;
		// changed unsigned char to uint
		unsigned int initBuf[96];
		unsigned int * mixWords;
		unsigned int tempNode[16];
		Keccak * keccak;
		unsigned int retWords[8];
		unsigned int * initWords;

		Ethash(Params * params,unsigned int cache[])
		{
			this->params = params;
			this->cache = cache;
			// preallocate buffers/etc
			
			// got rid of initBytes and retBytes 
			// don't need 2 datastructures pointing to the same buffer.

			this->initWords = this->initBuf;
			this->mixWords = new unsigned int[this->params->mixSize / 4];
			this->keccak = new Keccak();
			
		}
		
		
		unsigned int * hash (unsigned int * header,unsigned char * nonce)
		{
			// compute initial hash

			//checked from the javascript version of the miner that the header size is always 44
			for (unsigned int i = 0; i < 44; i++)
			{
				// changed initBytes to initWords
				this->initWords[i] = header[i];
			}
			// we know nonce is always 8 uint8_t elements (64 bit nonce)
			for (unsigned int i = 32; i < 40; i++)
			{
				// changed initBytes to initWords
				this->initWords[i] = (unsigned int)nonce[i-32];
			}
			this->keccak->digestWords(this->initWords, 0, 16, this->initWords, 0, 10);


			// compute mix
			for (unsigned int i = 0; i != 16; ++i)
			{
				this->mixWords[i] = this->initWords[i];
			}
			computeHashInner(this->mixWords, this->params, this->cache, this->keccak, this->tempNode);

			// compress mix and append to initWords

			// note: this->params->mixSize / 4 = mixwords.length
			for (unsigned int i = 0; i != this->params->mixSize / 4; i = i + 4)
			{
				this->initWords[16 + i/4] = fnv(fnv(fnv(this->mixWords[i], this->mixWords[i+1]), this->mixWords[i+2]), this->mixWords[i+3]);
			}
				
			// final Keccak hashes
			this->keccak->digestWords(this->retWords, 0, 8, this->initWords, 0, 24); // Keccak-256(s + cmix)
			return this->retWords;
		}
};

void deserialize(std::string str, unsigned int * outArr, unsigned int size)
{
	std::stringstream ss(str);
	unsigned int i = 0;
    while (ss.good() && i < size)
    {
        ss >> outArr[i];
        ++i;
    }
}

double mine(std::string headerStr, std::string cacheStr, std::string dagStr, unsigned int startIndex, unsigned int cacheSize, unsigned int dagSize)
{
	// the hash must be less than the following for the nonce to be a valid solutions
	// double solutionThreshold = pow(10,72);
	Params params(cacheSize,dagSize);
	unsigned int header[44];
	unsigned int * cache = new unsigned int[cacheSize];
	dag = new unsigned int[numSlicesLocal*16]();

	deserialize(headerStr,header,44);
	deserialize(cacheStr,cache,cacheSize);
	store(dagStr);
	
	Ethash hasher(&params, cache);	
	unsigned char nonce[] = {0,0,0,0,0,0,0,0};
	unsigned int trials = 10000;
	unsigned int * hash;

	// timing the hashes
	std::chrono::high_resolution_clock::time_point start;
  	std::chrono::high_resolution_clock::time_point stop;

  	start = std::chrono::high_resolution_clock::now();
	for (unsigned int i = 0; i < trials; i++)
	{
		hash = hasher.hash(header, nonce);
		nonce[rand() % 8] = rand() % 256;
	}
	stop = std::chrono::high_resolution_clock::now();

	std::chrono::duration<double, std::milli> time = stop - start;
	printf("cache hit rate:  %f\n",((float)cacheHit/(float)numAccesses));
	double hashRate = 1000.0*trials/(time.count());
	return hashRate;
}


EMSCRIPTEN_BINDINGS(mineModule){
	function("mine", &mine);
}



// int main()
// {
// 	unsigned int dagSize = 268434976;
// 	startIndex = 0;
// 	int numSlicesLocal = 10000;
// 	unsigned int cacheSize = 4194224;

// 	unsigned int * cache = new unsigned int[4194224];
// 	dag = new unsigned int[numSlicesLocal*16]();
// 	unsigned int header[44];

// 	for (int i = 0; i < 4194224; i++)
// 		cache[i] = 42;
// 	for (int i = 0; i < 44; i++)
// 		header[i] = 34;
// 	for (int i = 0; i < numSlicesLocal; i++)
// 		dag[i] = 54;


// 	Params params(cacheSize,dagSize);
// 	Ethash hasher(&params, cache);	
// 	unsigned char nonce[] = {0,0,0,0,0,0,0,0};
// 	unsigned int trials = 10000;
// 	unsigned int * hash;

// 	// timing the hashes
// 	std::chrono::high_resolution_clock::time_point start;
//   	std::chrono::high_resolution_clock::time_point stop;

//   	start = std::chrono::high_resolution_clock::now();
// 	for (int i = 0; i < trials; i++)
// 	{
// 		hash = hasher.hash(header, nonce);
		// nonce[rand() % 8] = rand() % 256;
// 	}
// 	stop = std::chrono::high_resolution_clock::now();

// 	std::chrono::duration<double, std::milli> time = stop - start;
// 	double hashRate = 1000.0*trials/(time.count());
// 	printf("cache hit rate:  %f\n",((float)cacheHit/(float)numAccesses));
	// printf("hash rate:  %f\n",hashRate);
// 	return 0;
// }

// none of the cache indices are bigger than 7 digits (ex: 4103536)