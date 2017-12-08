
#!/usr/bin/env python

import sys, socket, threading, traceback

# each client is handled on a separate thread -- threading implemented in network_thread
from network_thread import *

#------BETWEEN SERVER AND CLIENT--------#

#creating socket that supports IPv4 and is relaible. This is for reciecing client side data
serversock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# bind to port 8000
port = 8000

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

counter = 0
main_thread = threading.currentThread()
while 1:
	try:
		(clientsock, addr) = serversock.accept()
		# handle each connection on a seperate thread
		header = [random.randint(1,1000) for i in range(15)]
		threadclient = network_thread(clientsock,header)
		threadclient.daemon = True
		threadclient.start()
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
	except Exception as e:
		print e
		exc_type, exc_value, exc_traceback = sys.exc_info()
    		traceback.print_tb(exc_traceback, limit=5, file=sys.stdout)
		print "[*] Closing port " + str(port) + "..."
		serversock.shutdown(socket.SHUT_RDWR)
		serversock.close()
		print "[*] Terminating all running threads...Successful"
		for t in threading.enumerate():
			if t is main_thread:
        			continue
			t.terminate = True #flag allows cleanup actions to be performed
		sys.exit(1)
