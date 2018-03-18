#!/usr/bin/env python

import pylab as plt
import numpy as np

def main():
	with open("distribution-data.txt") as handler:
		lines = handler.read().splitlines()[1:]
		data = np.array([int(i) for i in lines])
		# plt.barh(np.arange(len(data)),data,align='center')
		print sum(data[:len(data)/3])/float(len(data)/3)
		print sum(data[len(data)/3:2*len(data)/3])/float(2*len(data)/3 - len(data)/3)
		print sum(data[2*len(data)/3:])/float(len(data) - 2*len(data)/3)
		plt.plot(data,'ro')
		plt.show()

if __name__ == '__main__':
	main()