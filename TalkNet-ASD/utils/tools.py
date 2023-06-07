import os, subprocess, glob, pandas, tqdm, cv2, numpy
from scipy.io import wavfile

def init_args(args):
    args.modelSavePath    = os.path.join(args.savePath, 'model')
    args.scoreSavePath    = os.path.join(args.savePath, 'score.txt')
    args.trialPath        = os.path.join(args.dataPath, 'csv')
    args.audioPathDATA    = os.path.join(args.dataPath, 'clips_audios')
    args.visualPathDATA   = os.path.join(args.dataPath, 'clips_videos')
    args.trainTrial       = os.path.join(args.trialPath, 'train_loader.csv')

    if args.evalDataType == 'val':
        args.evalTrial    = os.path.join(args.trialPath, 'val_loader.csv')
        args.evalOrig     = os.path.join(args.trialPath, 'val_orig.csv')  
        args.evalCsvSave  = os.path.join(args.savePath,  'val_res.csv') 
    else:
        args.evalTrial    = os.path.join(args.trialPath, 'test_loader.csv')
        args.evalOrig     = os.path.join(args.trialPath, 'test_orig.csv')    
        args.evalCsvSave  = os.path.join(args.savePath,  'test_res.csv')
    
    os.makedirs(args.modelSavePath, exist_ok = True)
    os.makedirs(args.dataPath, exist_ok = True)
    return args
 


