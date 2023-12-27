import azure.functions as func
import numpy as np
from time import time


def matmul(N):
    A = np.random.rand(N, N)
    B = np.random.rand(N, N)

    start = time()
    C = np.matmul(A, B)
    latency = time() - start

    return latency


def main(req: func.HttpRequest) -> func.HttpResponse:
    N = 100
    latency = str(matmul(N))

    return func.HttpResponse(latency)