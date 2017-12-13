#use the following commands
#dependant on web3.py, npm install web3
#./geth --identity "TestNet" --nodiscover --networkid 700 --datadir ~/ethblock --rpc --rpcaddr localhost --rpcport 4000 --mine console

from web3 import Web3, HTTPProvider, IPCProvider
import time

web3 = Web3(HTTPProvider('http://localhost:4000'))
t_end = time.time() + 60 * 1
f = open('VMcpu.txt','w')
old = 0
while time.time() < t_end:
	print(str(web3.eth.hashrate), file=f)
	print (str(web3.eth.hashrate))
	time.sleep(1)
f.close()
