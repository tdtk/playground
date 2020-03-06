from puppy2d import *
setGravity(0, -1)
Rectangle(0, -300, 800, 50, isStatic=True)
C = 0
x = Circle(0, 300, 150, restitution=1.0, showing='C')
def __movein__(x,y):
    print('hit')
    C += 1
def __keydown__(key):
    print(key)
    x.position = (0,200)