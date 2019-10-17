from matplotlib import style
import matplotlib.pyplot as plt
import numpy as np
from mpl_toolkits.mplot3d import Axes3D
import time
import influxdb
from influxdb import InfluxDBClient


filename = 'data.csv'

starttime = time.time()

style.use('seaborn-notebook')

# pastTime = '2m'
# nowTime = '4m'
# client = InfluxDBClient(host='aworldbridgelabs.com', port=8086, username='rayf', password='RayESP8010')
# client.switch_database('RayESP')
# # qResult = client.query("SELECT * FROM station_one WHERE time >= '2019-9-10T10:10:10Z' AND time<='2019-9-12T10:10:10Z' GROUP BY time(5s)")
# qResult = client.query("SELECT * FROM far where time >= '2018-9-10T10:10:10Z'")
# print("s")
# print(qResult.raw)
# print("m")


# fail
# # Python and Gevent
# from gevent.pywsgi import WSGIServer
# from gevent import monkey
# monkey.patch_all() # makes many blocking calls asynchronous
#
# def application(environ, start_response):
#     if environ["REQUEST_METHOD"]!="POST": # your JS uses post, so if it isn't post, it isn't you
#         start_response("403 Forbidden", [("Content-Type", "text/html; charset=utf-8")])
#         return "403 Forbidden"
#     start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
#     r = environ["wsgi.input"].read() # get the post data
#     return r
#     print(r)
#
# address = "youraddresshere", 8080
# server = WSGIServer(address, application)
# server.backlog = 256
# server.serve_forever()



print("eee~")
from flask import Flask,request,render_template,jsonify
app = Flask(__name__)
# @app.route('/')
# def index():
#     return render_template('dyGr.html')


@app.route('/process',methods= ['GET'])
def process():
    # print(request)
    # print(request.args.get('key1'))
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
    fig.savefig('../../../liveDataVis/3D_Vector_Arrow.png', bbox_inches='tight')
    # fig.savefig('/Users/imacbig10/Desktop/RayEverything/DataVis/liveDataVis/3D_Vector_Arrow.png', bbox_inches='tight')
    plt.show()
    plt.close(fig)
    return "qerrt1"


@app.route('/process2',methods= ['GET'])
def process2():
    # print(request)
    # print(request.args.get('key1'))
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
    fig.savefig('../../../liveDataVis/3D_Vector_Arrow2.png', bbox_inches='tight')
    # fig.savefig('/Users/imacbig10/Desktop/RayEverything/DataVis/liveDataVis/3D_Vector_Arrow.png', bbox_inches='tight')
    plt.show()
    plt.close(fig)


    # lastName = request.ya
    # output = firstName + lastName
    # print(output)
    # if firstName and lastName:
    #     return jsonify({'output':'Full Name: ' + output })
    # return jsonify({'error' : 'Missing data!'})
    return "qerrt2"



# if __name__ == '__main__':
app.run(host="localhost", port=7000, debug=False)





# while True:
#     # with open('data.csv', 'r') as fin:
#     #     data = fin.read().splitlines(True)
#     # with open('data.csv', 'w') as fout:
#     #     fout.writelines(data[1:])
# #
# #
# #
# #     x = []
# #     y = []
# #     z = []
# # #
# #     _data = np.loadtxt(filename, delimiter=',', dtype=float)
# #
# #     for row in _data:
# #         x.append(float(row[0]))
# #         y.append(float(row[1]))
# #         z.append(float(row[2]))
# #
# #     total = x + y
# #     direction = (sum(total) / len(total))
# #     depth = (np.mean(z))
# #
# # # Gets value of variables from datavis.py
# # # Also gets average of array and rounds them into integers
# #
# #     x = np.mean(x)
# #     x = round(x)
# #
# #     y = np.mean(y)
# #     y = round(y)
# #
# #     z = round(depth)
#
#
    # fig = plt.figure()
    # ax = fig.add_subplot(111, projection='3d')
    #
    # p = [x, y, z]
    #
    # origin = [0, 0, 0]
    # X, Y, Z = zip(origin)
    # U, V, W = zip(p)
    #
    # ax.set_xlabel('North(%d)' % x, labelpad=15)
    # ax.set_ylabel('East(%d)' % y, labelpad=15)
    # ax.set_zlabel('Depth(%d)' % z, labelpad=15)
    #
    # ax.set_xlim([-200000, 200000])
    # ax.set_ylim([-200000, 200000])
    # ax.set_zlim([-200000, 0])
    #
    # plt.title('Depth and direction of disruption', fontsize=20)
    #
    # print("refreshed")
    # ax.quiver(X, Y, Z, U, V, W, arrow_length_ratio=0.2, color="red", label="ESP Vector", linewidth=4)
    #
    # # Turn off tick labels
    # plt.locator_params(axis='x', nbins=5)
    # plt.locator_params(axis='y', nbins=5)
    # plt.locator_params(axis='z', nbins=5)
    #
    # plt.tight_layout(0.1)
    # fig.savefig('3D_Vector_Arrow.png', bbox_inches='tight')
    # plt.show()
    # plt.close(fig)
#
# time.sleep(4.0 - (time.time() % 4.0))
