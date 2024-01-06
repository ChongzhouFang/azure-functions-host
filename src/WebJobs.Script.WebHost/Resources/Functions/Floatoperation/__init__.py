import azure.functions as func
import math
from time import time


def float_operations(N):
    start = time()
    for i in range(0, N):
        sin_i = math.sin(i)
        cos_i = math.cos(i)
        sqrt_i = math.sqrt(i)
    latency = time() - start
    return latency


def main(req: func.HttpRequest) -> func.HttpResponse:
    N = 10
    latency = str(float_operations(N))

    return func.HttpResponse('benchmark floatoperation runtime: ' + latency)