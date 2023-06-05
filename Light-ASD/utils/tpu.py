import torch
import torch_xla
import torch_xla.core.xla_model as xm

def tpu():
    device = xm.xla_device()
    return device