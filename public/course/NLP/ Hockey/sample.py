from puppy2d import *

Rectangle(0, 500, 800, 50, isStatic=True)
Rectangle(0, -500, 800, 50, isStatic=True)
Rectangle(400, 0, 50, 1000, isStatic=True)
Rectangle(-400, 0, 50, 1000, isStatic=True)

Circle(0, 300, 50)
Circle(0, -300, 50)
Circle(0, 0, 25, restitution=0.9)
