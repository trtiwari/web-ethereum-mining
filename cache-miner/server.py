#!/usr/bin/env python

import sys, socket, threading, traceback, json,random,logging,sha3

# bind to port 
port = 9000

FOUND_ANS = False

def mkcache(cache_size, seed):
    o = [[random.randint(0,100) for i in range(16)] for i in range(262139)]
    return o

class network_thread(threading.Thread):
	def __init__(self, clientsock, header):
		sys.stdout.flush()
		threading.Thread.__init__(self)
		self.clientsock = clientsock
		self.header = header
		self.terminate = False
		connection_header = self.clientsock.recv(4096)
	def run(self):
		try:
			while not self.terminate:
				# generate random block header, fullsize and dag_slices
				fullsize = 2
				json_dict = {"header":self.header,"cache":cache}
				body = json.dumps(json_dict)
				response = "HTTP/1.1 200 OK\r\n"
				response += "Server: localhost:{0}\r\n".format(port)
				response += "Content-Length: {0}\r\n".format(len(body))
				response += "\r\n"
				response += body
				# send over to client
				self.clientsock.sendall(response)
				# print "Sent data", json_dict
				# recieve the nonce from the client
				# this method will block (keep hanging) until the browser actually sends something back
				response = self.clientsock.recv(8096)
				if "POST" in response:
					print response
					begin = response.find("\r\n\r\n") + len("\r\n\r\n")
					print "GOT here!"
					print json.loads(response[begin:])
					nonce = int(response[begin:end])
					print "[*] Mined a valid block with nonce: ",nonce
					FOUND_ANS = True
		except Exception as e:
			pass
			# logging.debug( e )
		# 	exc_type, exc_value, exc_traceback = sys.exc_info()
	 #    		traceback.print_tb(exc_traceback, limit=5, file=sys.stdout)




#------BETWEEN SERVER AND CLIENT--------#

#creating socket that supports IPv4 and is relaible. This is for recieving client side data
serversock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

#bind port on all interfaces
try:
	serversock.bind(('',port))
except Exception:
	print "[*] port " + str(port) + " is being used by another process. Make sure to free the port before starting server."
	sys.exit(1)

#queues up a maximum of 20 client connections
serversock.listen(20)

print "[*] Server started, listening on port " + str(port)

#------MAIN LOOP--------#

main_thread = threading.currentThread()
header_size = 2
connection_counter = 0
HASH_BYTES = 64                   # hash length in bytes
cache = mkcache(33554432,1234567890)
print "[*] Computed cache"

while 1:
	try:
		clientsock, addr = serversock.accept()
		connection_counter+=1
		# print "[*] Recieved connection from new browser ... connection #",connection_counter
		# handle each connection on a seperate thread
		header = "129109f0910901ecd0302c"
		threadclient = network_thread(clientsock,header)
		threadclient.daemon = True
		threadclient.start()
		# print "[*] Got here!"
		if FOUND_ANS:
			FOUND_ANS = False
			for t in threading.enumerate():
				if t is main_thread:
	        			continue
				t.header = [random.randint(1,1000) for i in range(header_size)]
	except KeyboardInterrupt:
		print "\n\n[*] User requested server.py to be aborted..."
		print "[*] Closing port " + str(port) + "..."
		serversock.shutdown(socket.SHUT_RDWR)
		serversock.close()
		print "    Successful"
		print "[*] Terminating all running threads..."
		# terminate threads
		for t in threading.enumerate():
			if t is main_thread:
        			continue
			t.terminate = True #flag allows cleanup actions to be performed
		print "    Successful" 
		print "[*] Server shutting down." 
		sys.exit(0)
	# except Exception as e:
	# 	print e
	# 	exc_type, exc_value, exc_traceback = sys.exc_info()
 #    		traceback.print_tb(exc_traceback, limit=5, file=sys.stdout)
	# 	print "[*] Closing port " + str(port) + "..."
	# 	serversock.shutdown(socket.SHUT_RDWR)
	# 	serversock.close()
	# 	print "[*] Terminating all running threads...Successful"
	# 	for t in threading.enumerate():
	# 		if t is main_thread:
 #        			continue
	# 		t.terminate = True #flag allows cleanup actions to be performed
	# 	sys.exit(1)
