/*
void mine(unsigned int header[], unsigned int cache[] ){
	// the hash must be less than the following for the nonce to be a valid solutions
	unsigned int solutionThreshold = 10**72;
	// if the browser cannot find a solution within these many miliseconds, we give it a new block to mine
	unsigned int timeToGetCurrentBlock = 10000000; // ms

	Params * ethashParams = new Params();

	Ethash * hasher = new Ethash(ethashParams, cache);
	
	// fix
	unsigned char nonce[] = {1,2,4,5,6,7,3,2};
	unsigned int* hash;

	chrono::high_resolution_clock::time_point start;
	int trials = 10000;
	start = chrono::high_resolution_clock::now();
	for (int i = 0; i < trials; ++i)
	{
		hash = hasher->hash(header, nonce);
		nonce[0]++;
		if (parseInt(Util.bytesToHexString(hash),16) < solutionThreshold)
		{
			cout << "VALID NONCE FOR RESULT ";// + Util.bytesToHexString(hash);
			// FIX these 
			
			// var solution = JSON.stringify({WorkerDigest:Util.serializeIterableObject(hash),WorkerNonce:nonce,WorkerResult:Util.serializeIterableObject(result)});
			// http_post(endpoint,solution);
			// http_get(endpoint);
			
			return;
		}
		else if (std::chrono::duration_cast<std::chrono::nanoseconds>(chrono::high_resolution_clock::now() - start).count()/1000000.0 > timeToGetCurrentBlock)
		{
			console.log("TIME UP!");
			http_get(endpoint);
			return;
		}
	}

	unsigned int hashrate = 1000/((std::chrono::duration_cast<std::chrono::nanoseconds>(chrono::high_resolution_clock::now() - start).count()/1000000.0)/trials)
	cout << "Light client hashes average hashrate: " << hashrate;
	// alert(hashrate);
	// console.log("Hash = " + Util.bytesToHexString(hash));
}
*/