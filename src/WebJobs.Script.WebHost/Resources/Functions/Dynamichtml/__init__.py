import azure.functions as func
import numpy as np
from time import time
from datetime import datetime   
from random import sample
from jinja2 import Template
import os

# adopted from https://github.com/spcl/serverless-benchmarks/blob/master/benchmarks/100.webapps/110.dynamic-html/python/function.py

def main(req: func.HttpRequest) -> func.HttpResponse:
    startTime = time()

    SCRIPT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__)))
    size = 100
    random_numbers = sample(range(0, 1000000), size)
    template = Template(open(os.path.join(SCRIPT_DIR, 'template.html')).read())
    html = template.render(username = 'testuser', cur_time = datetime.now(), random_numbers = random_numbers)
    print(html)
    latency = str(time() - startTime)

    return func.HttpResponse('benchmark dynamichtml runtime: ' + latency + '\n')