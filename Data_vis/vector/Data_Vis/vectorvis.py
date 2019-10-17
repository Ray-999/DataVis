from matplotlib import style
import matplotlib.pyplot as plt
import numpy as np
from mpl_toolkits.mplot3d import Axes3D
import time

filename = '/Users/imacbig01/PycharmProjects/Data_vis/vector/Data_Vis/data.csv'

starttime = time.time()

style.use('seaborn-notebook')

while True:
    with open('/Users/imacbig01/PycharmProjects/Data_vis/vector/Data_Vis/data.csv', 'r') as fin:
        data = fin.read().splitlines(True)
    with open('/Users/imacbig01/PycharmProjects/Data_vis/vector/Data_Vis/data.csv', 'w') as fout:
        fout.writelines(data[1:])

    x = []
    y = []
    z = []

    _data = np.loadtxt(filename, delimiter=',', dtype=float)

    for row in _data:
        x.append(float(row[0]))
        y.append(float(row[1]))
        z.append(float(row[2]))

    total = x + y
    direction = (sum(total) / len(total))
    depth = (np.mean(z))

# Gets value of variables from datavis.py
# Also gets average of array and rounds them into integers

    x = np.mean(x)
    x = round(x)

    y = np.mean(y)
    y = round(y)

    z = round(depth)

    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')

    p = [x, y, z]

    origin = [0, 0, 0]
    X, Y, Z = zip(origin)
    U, V, W = zip(p)

    ax.set_xlabel('North(%d)' % x, labelpad=15)
    ax.set_ylabel('East(%d)' % y, labelpad=15)
    ax.set_zlabel('Depth(%d)' % z, labelpad=15)

    ax.set_xlim([-200000, 200000])
    ax.set_ylim([-200000, 200000])
    ax.set_zlim([-200000, 0])

    plt.title('Depth and direction of disruption', fontsize=20)

    print("refreshed")
    ax.quiver(X, Y, Z, U, V, W, arrow_length_ratio=0.2, color="red", label="ESP Vector", linewidth=4)

    # Turn off tick labels
    plt.locator_params(axis='x', nbins=5)
    plt.locator_params(axis='y', nbins=5)
    plt.locator_params(axis='z', nbins=5)

    plt.tight_layout(0.1)
    fig.savefig('3D_Vector_Arrow.png', bbox_inches='tight')
    plt.show()
    plt.close(fig)

    time.sleep(4.0 - (time.time() % 4.0))
