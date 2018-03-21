#!/usr/bin/env python

import matplotlib.pyplot as plt
import numpy as np
import math

n = 16777186

y = list()
x = np.linspace(0,0.99,100,endpoint=True)
for f in x:
	y.append(n*math.log(1/(1-f))/64)

for i_x,i_y in zip(x,y):
	# if i_y > 500000:
	# 	print i_x
	# 	break
	if i_x > 0.95:
		print i_y
		break
# plt.imshow(data_set, cmap='binary', interpolation='nearest')

plt.plot(x,y)
plt.xlabel('f')
plt.ylabel('E(H)')
plt.show()