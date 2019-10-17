from matplotlib import style
import matplotlib.pyplot as plt
import numpy as np
from mpl_toolkits.mplot3d import Axes3D
import time
import influxdb
from influxdb import InfluxDBClient
from flask import Flask,request,render_template,jsonify
app = Flask(__name__)


@app.route('/process',methods= ['GET'])
def process():
    global x, y, z
    x = float(request.args.get('key1'))
    y = float(request.args.get('key2'))
    z = float(request.args.get('key3'))
    print(x)
    print(y)
    print(z)



    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')

    p = [x, y, z]

    origin = [0, 0, 0]
    X, Y, Z = zip(origin)
    U, V, W = zip(p)

    ax.set_xlabel('North(%d)' % x, labelpad=15)
    ax.set_ylabel('East(%d)' % y, labelpad=15)
    ax.set_zlabel('Depth(%d)' % z, labelpad=15)

    ax.set_xlim([-100000, 100000])
    ax.set_ylim([-100000, 100000])
    ax.set_zlim([-100000, 0])

    plt.title('Depth and direction of disruption', fontsize=20)

    print("refreshed")
    ax.quiver(X, Y, Z, U, V, W, arrow_length_ratio=0.3, color="red", label="ESP Vector", linewidth=8)

    # Turn off tick labels
    plt.locator_params(axis='x', nbins=5)
    plt.locator_params(axis='y', nbins=5)
    plt.locator_params(axis='z', nbins=5)

    plt.tight_layout(0.1)
    fig.savefig('3D_Vector_Arrow.png', bbox_inches='tight')
    plt.show()
    plt.close(fig)

    return "vector picture done"
app.run(host="localhost", port=7000, debug=True)





