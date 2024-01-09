import azure.functions as func
import numpy as np
from time import time


def main(req: func.HttpRequest) -> func.HttpResponse:
    startTime = time()

    latency = str(startTime)

    return func.HttpResponse('benchmark startup runtime: ' + latency + '\n')