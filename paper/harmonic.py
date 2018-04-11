#!/usr/bin/env python

import numpy as np
import math

N = 16777186
d = 0.000000005
a = 64
e = 0.5772156649

def upperH(n):
	return math.log(n) + (1/(2.0*n)) + e -(1/((12.0*(n**2)) + (6/5.0)))

def lowerH(n):
	return math.log(n) + (1/(2.0*n)) + e -(1/( (12.0*(n**2) ) + ( 2*(7-(12*e))/((2*e)-1) )))


def upperExpectedHashes(n,d,a):
	return (n/a)*(upperH(n) - lowerH(n*d))

def lowerExpectedHashes(n,d,a):
	return (n/a)*(lowerH(n) - upperH(n*d))

print upperExpectedHashes(N,d,a)
print lowerExpectedHashes(N,d,a)
