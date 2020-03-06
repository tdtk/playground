from puppy2d import *
for i in [-300, 300]:
    Rectangle(i, 0, 50, 900, isStatic=True)
for i in [-450, 450]:
    Rectangle(0, i, 600, 50, isStatic=True)
Circle(0, 200, 55, restitution=1.2)
for i in [30, -30]:
    Circle(i, 250, 55, restitution=1.2)
for i in [-60, 0, 60]:
    Circle(i, 300, 55, restitution=1.2)
for i in [-90, -30, 30, 90]:
    Circle(i, 350, 55, restitution=1.2)
Circle(0, -200, 70, restitution=1.8, mass=1000)