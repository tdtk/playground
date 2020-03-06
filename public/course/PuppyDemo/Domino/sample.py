from puppy2d import *
​
setGravity(0, -1)
​
Rectangle(0, -250, 1000, 30, isStatic=True)
​
for i in range(-400, 400, 80):
    Rectangle(i, 100, 20, 150)
​
Circle(-420, 200, 100)
