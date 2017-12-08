
import traceback,sys,json,random

# ARCHITECHTURE:
# some of it still needs to be implemented
# each instance of the thread represents one browser
# all threads must be initialized with the same header, so that all clients mine the same block
# if any one instance of the thread finds the answer, that instance must let the main procedure know
# via some signal so that the main procedure can hand in new block headers to every browser to start mining them
# if none of the browsers can find anything, server should timeout and move to the next block header (i.e., send all 
# browsers another block header)

class network_thread(threading.Thread):
	def __init__(self, clientsock):
		threading.Thread.__init__(self,header)
		self.clientsock = clientsock
		self.header = header

	def run(self):
		try:
			self.clientsock.settimeout(4)
			while not self.terminate:
				# generate random block header, fullsize and dag_slices
				fullsize = 300
				dag_slices = [[random.randint(1,1000) for j in range(16)] for i in range(full_size)]
				json_dict = {"header":header,"fullsize":fullsize,"mix":mix}
				# send over to client
				self.clientsock.sendall(json.dumps(json_dict))
				# recieve the nonce from the client
				# this method will block (keep hanging) until the browser actually sends something back
				answer = json.loads(self.clientsock.recv(4096))
				# TO DO: send a notification to the main thread to let it know that this block has been solved
				# the main thread will then send all the clients 
				# now 
		except Exception as e:
			logging.debug( e )
			exc_type, exc_value, exc_traceback = sys.exc_info()
	    		traceback.print_tb(exc_traceback, limit=5, file=sys.stdout)
