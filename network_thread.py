#!/usr/bin/env python

import traceback,sys,json,random,threading,logging

# ARCHITECHTURE:
# some of it still needs to be implemented
# each instance of the thread represents one browser
# all threads must be initialized with the same header, so that all clients mine the same block
# if any one instance of the thread finds the answer, that instance must let the main procedure know
# via some signal so that the main procedure can hand in new block headers to every browser to start mining them
# if none of the browsers can find anything, server should timeout and move to the next block header (i.e., send all 
# browsers another block header)

class network_thread(threading.Thread):
	def __init__(self, clientsock, header):
		print "got here"
		sys.stdout.flush()
		threading.Thread.__init__(self)
		self.clientsock = clientsock
		self.header = header
		self.terminate = False

	def run(self):
		# try:
		print "Running"
		# self.clientsock.settimeout(4)
		while not self.terminate:
			# generate random block header, fullsize and dag_slices
			fullsize = 300
			dag_slices = [[random.randint(1,1000) for j in range(16)] for i in range(fullsize)]
			json_dict = {"header":self.header,"fullsize":fullsize,"mix":dag_slices}
			# send over to client
			self.clientsock.sendall(json.dumps(json_dict))
			print "sent data", json_dict
			# recieve the nonce from the client
			# this method will block (keep hanging) until the browser actually sends something back
			json_string = self.clientsock.recv(8096)
			print json_string
			answer = json.loads(json_string)
			# TO DO: send a notification to the main thread to let it know that this block has been solved
			# the main thread will then send all the clients 
			# now 
		# except Exception as e:
		# 	logging.debug( e )
		# 	exc_type, exc_value, exc_traceback = sys.exc_info()
	 #    		traceback.print_tb(exc_traceback, limit=5, file=sys.stdout)
