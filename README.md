# WebEth: a distributed, browser-based Ethereum Miner in WASM and JS

Usage:
There is 2 aspects to this: the client (browser) and the server (the one that distributes the PoW)

Server:
1) To create a central server that distributes the PoW, we use a modified version of Geth. 
2) To obtain this modified version, install Geth and add the files present in the ``geth-modification'' folder to the /consensus/ethash/
folder in Geth source tree. Note that sealer.go already exists in Geth, and so you would need to overwrite it with the one provided
in this repository.
3) Compile this modified version of Geth (instructions available in the Geth repository) and start the server.
4) The server will listen at port 9000 for any incoming client connections from browsers.

Client:
1) Change the ip of provided in miner.js (present in both the wasm and js implementations) to be the IP of the central server
2) Run start-browser.sh (assumes linux with google chrome for now), and the browser will connect to the central server,
get the current header hash and cache and then will start mining.
