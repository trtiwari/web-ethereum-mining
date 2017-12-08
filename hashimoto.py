#!/usr/bin/env python

WORD_BYTES = 4                    # bytes in word
DATASET_BYTES_INIT = 2**30        # bytes in dataset at genesis
DATASET_BYTES_GROWTH = 2**23      # dataset growth per epoch
CACHE_BYTES_INIT = 2**24          # bytes in cache at genesis
CACHE_BYTES_GROWTH = 2**17        # cache growth per epoch
CACHE_MULTIPLIER=1024             # Size of the DAG relative to the cache
EPOCH_LENGTH = 30000              # blocks per epoch
MIX_BYTES = 128                   # width of mix
HASH_BYTES = 64                   # hash length in bytes
DATASET_PARENTS = 256             # number of parents of each dataset element
CACHE_ROUNDS = 3                  # number of rounds in cache production
ACCESSES = 64                     # number of accesses in hashimoto loop

def get_cache_size(block_number):
    sz = CACHE_BYTES_INIT + CACHE_BYTES_GROWTH * (block_number // EPOCH_LENGTH)
    sz -= HASH_BYTES
    while not isprime(sz / HASH_BYTES):
        sz -= 2 * HASH_BYTES
    return sz

def get_full_size(block_number):
    sz = DATASET_BYTES_INIT + DATASET_BYTES_GROWTH * (block_number // EPOCH_LENGTH)
    sz -= MIX_BYTES
    while not isprime(sz / MIX_BYTES):
        sz -= 2 * MIX_BYTES
    return sz

def mkcache(cache_size, seed):
    n = cache_size // HASH_BYTES

    # Sequentially produce the initial dataset
    o = [sha3_512(seed)]
    for i in range(1, n):
        o.append(sha3_512(o[-1]))

    # Use a low-round version of randmemohash
    for _ in range(CACHE_ROUNDS):
        for i in range(n):
            v = o[i][0] % n
            o[i] = sha3_512(map(xor, o[(i-1+n) % n], o[v]))

    return o

FNV_PRIME = 0x01000193

def fnv(v1, v2):
    return ((v1 * FNV_PRIME) ^ v2) % 2**32

def calc_dataset_item(cache, i):
    n = len(cache)
    r = HASH_BYTES // WORD_BYTES
    # initialize the mix
    mix = copy.copy(cache[i % n])
    mix[0] ^= i
    mix = sha3_512(mix)
    # fnv it with a lot of random cache nodes based on i
    for j in range(DATASET_PARENTS):
        cache_index = fnv(i ^ j, mix[j % r])
        mix = map(fnv, mix, cache[cache_index % n])
    return sha3_512(mix)

def calc_dataset(full_size, cache):
    return [calc_dataset_item(cache, i) for i in range(full_size // HASH_BYTES)]

def hashimoto(header, nonce, full_size, dataset_lookup):
    n = full_size / HASH_BYTES
    w = MIX_BYTES // WORD_BYTES
    mixhashes = MIX_BYTES / HASH_BYTES
    # combine header+nonce into a 64 byte seed
    # had to change from nonce[::-1] to [nonce] because it doesn't make sense to slice a number
    s = sha3_512(header + [nonce])
    # start the mix with replicated s
    mix = []
    for _ in range(MIX_BYTES / HASH_BYTES):
        mix.extend(s)
    # mix in random dataset nodes
    for i in range(ACCESSES):
        p = fnv(i ^ s[0], mix[i % w]) % (n // mixhashes) * mixhashes
        newdata = []
        for j in range(MIX_BYTES / HASH_BYTES):
            newdata.extend(dataset_lookup(p + j))
        mix = map(fnv, mix, newdata)
    # print mix
    # compress mix
    cmix = []
    for i in range(0, len(mix), 4):
        cmix.append(fnv(fnv(fnv(mix[i], mix[i+1]), mix[i+2]), mix[i+3]))
    return {
        "mix digest": serialize_hash(cmix),
        "result": serialize_hash(sha3_256(s+cmix))
    }

def hashimoto_light(full_size, cache, header, nonce):
    return hashimoto(header, nonce, full_size, lambda x: calc_dataset_item(cache, x))

def hashimoto_full(full_size, dataset, header, nonce):
    return hashimoto(header, nonce, full_size, lambda x: dataset[x])

def mine(full_size, dataset, header, difficulty):
    target = zpad(encode_int(2**256 // difficulty), 64)[::-1]
    from random import randint
    nonce = randint(0, 2**64)
    # had replace hashimoto_full(full_size, dataset, header, nonce)["result"] with hashimoto_full(full_size, dataset, header, nonce)
    while hashimoto_full(full_size, dataset, header, nonce)["result"] > target:
        nonce = (nonce + 1) % 2**64
    return nonce

def get_seedhash(block):
     s = '\x00' * 32
     for i in range(block.number // EPOCH_LENGTH):
         s = serialize_hash(sha3_256(s))
     return s

import sha3, copy

# Assumes little endian bit ordering (same as Intel architectures)
def decode_int(s):
    return int(s[::-1].encode('hex'), 16) if s else 0

def encode_int(s):
    a = "%x" % s
    return '' if s == 0 else ('0' * (len(a) % 2) + a).decode('hex')[::-1]

def zpad(s, length):
    return s + '\x00' * max(0, length - len(s))

def serialize_hash(h):
    return ''.join([zpad(encode_int(x), 4) for x in h])
  
def deserialize_hash(h):
    return [decode_int(h[i:i+WORD_BYTES]) for i in range(0, len(h), WORD_BYTES)]
  
def hash_words(h, sz, x):
    # print type(x)
    if isinstance(x, list):
        x = serialize_hash(x)
    y = h(x)
    return deserialize_hash(y)

def serialize_cache(ds):
    return ''.join([serialize_hash(h) for h in ds])
  
serialize_dataset = serialize_cache

# sha3 hash function, outputs 64 bytes

# needed to mod sha3_512 to convert v to str(v)
def sha3_512(x):
    return hash_words(lambda v: sha3.sha3_512(v).digest(), 64, x) if isinstance(x,list) else hash_words(lambda v: sha3.sha3_512(str(v)).digest(), 64, x)

def sha3_256(x):
    return hash_words(lambda v: sha3.sha3_256(v).digest(), 64, x) if isinstance(x,list) else hash_words(lambda v: sha3.sha3_256(str(v)).digest(), 64, x)
    # return hash_words(lambda v: sha3.sha3_256(str(v)).digest(), 32, x)

def xor(a, b):
    return a ^ b

def isprime(x):
    for i in range(2, int(x**0.5)):
         if x % i == 0:
             return False
    return True

# def hashimoto(header, nonce, full_size, mix):
#     n = full_size / HASH_BYTES
#     w = MIX_BYTES // WORD_BYTES
#     mixhashes = MIX_BYTES / HASH_BYTES
#     # combine header+nonce into a 64 byte seed
#     s = sha3_512(header + nonce[::-1])
#     # compress mix
#     cmix = []
#     for i in range(0, len(mix), 4):
#         cmix.append(fnv(fnv(fnv(mix[i], mix[i+1]), mix[i+2]), mix[i+3]))
#     return {
#         "mix digest": serialize_hash(cmix),
#         "result": serialize_hash(sha3_256(s+cmix))
#     }

# def hashimoto_full(worker_addr, full_size, dataset, header, nonce):
# 	dataset_lookup = lambda x: dataset[x]
# 	# start the mix with replicated s
#     mix = []
#     for _ in range(MIX_BYTES / HASH_BYTES):
#         mix.extend(s)
#     # mix in random dataset nodes
#     for i in range(ACCESSES):
#         p = fnv(i ^ s[0], mix[i % w]) % (n // mixhashes) * mixhashes
#         newdata = []
#         for j in range(MIX_BYTES / HASH_BYTES):
#             newdata.extend(dataset_lookup(p + j))
#         mix = map(fnv, mix, newdata)
#     return worker_addr.hashimoto(header, nonce, full_size, mix)

# def mine(full_size, dataset, header, difficulty):
#     target = zpad(encode_int(2**256 // difficulty), 64)[::-1]
#     from random import randint
#     solution_found = False
#     worker_addr_list = ['localhost:8000','localhost:9000']
#     while not solution_found:
# 	    for worker_addr in worker_addr_list:
# 		    nonce = randint(0, 2**64)
# 		    answer = hashimoto_full(worker_addr,full_size, dataset, header, nonce)
# 		    if answer < target:
# 		    	solution_found = True
# 		    	return nonce

import numpy as np

difficulty = 200
block_number = 2
max_int = 20000
header = [3,0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46,0x2302e1c0b972d00932deb5dab9eb2982f570597d9d42504c05d9c2147eaf9c88,
            0xfb6e1a62d119228b,0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347,0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
            0x3a1b03875115b79539e5bd33fb00d8f7b7cd61929d5a3c574f507b8acf415bee,0xf1133199d44695dfa8fd1bcfe424d82854b5cebef75bddd7e40ea94cda515bcb,
            0x8888f1f195afa192cfee860698584c030f4c9db1,difficulty,difficulty,616,0x0,3141592,21662,1429287689]

cache_size = get_cache_size(block_number)
# reducing cache_size and full_size so this runs in a reasonable time
cache_size %= max_int
cache = mkcache(cache_size,100)
full_size = get_full_size(block_number)
full_size %= max_int
dataset = calc_dataset(full_size,cache)
# DAG is a 2D array 
print(np.array(dataset).shape)
nonce = mine(full_size, dataset, header, difficulty)
print(nonce)