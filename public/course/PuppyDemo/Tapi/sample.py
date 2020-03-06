from puppy2d import *
import math
​
setGravity(0, -1)
​
Rectangle(0, -300, 400, 40, isStatic=True)
Rectangle(-230, 0, 40, 650, isStatic=True, angle=math.pi/20)
Rectangle(230, 0, 40, 650, isStatic=True, angle=-math.pi/20)
Rectangle(170, 170, 30, 700)
​
for x in range(15):
    Circle(x, 100, 70, restitution=1.0)