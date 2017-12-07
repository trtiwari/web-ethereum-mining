def hashimoto(header, nonce, full_size, mix):
    n = full_size / HASH_BYTES
    w = MIX_BYTES // WORD_BYTES
    mixhashes = MIX_BYTES / HASH_BYTES
    # combine header+nonce into a 64 byte seed
    s = sha3_512(header + nonce[::-1])
    # compress mix
    cmix = []
    for i in range(0, len(mix), 4):
        cmix.append(fnv(fnv(fnv(mix[i], mix[i+1]), mix[i+2]), mix[i+3]))
    return {
        "mix digest": serialize_hash(cmix),
        "result": serialize_hash(sha3_256(s+cmix))
    }

def hashimoto_full(worker_addr, full_size, dataset, header, nonce):
	dataset_lookup = lambda x: dataset[x]
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
    return worker_addr.hashimoto(header, nonce, full_size, mix)

def mine(full_size, dataset, header, difficulty):
    target = zpad(encode_int(2**256 // difficulty), 64)[::-1]
    from random import randint
    solution_found = False
    worker_addr_list = ['localhost:8000','localhost:9000']
    while not solution_found:
	    for worker_addr in worker_addr_list:
		    nonce = randint(0, 2**64)
		    answer = hashimoto_full(worker_addr,full_size, dataset, header, nonce)
		    if answer < target:
		    	solution_found = True
		    	return nonce