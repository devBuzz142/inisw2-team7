import time, os, torch, argparse, warnings, glob

from dataLoader import train_loader, val_loader
from utils.tools import *
from talkNet import talkNet

def main():
    warnings.filterwarnings("ignore")

    parser = argparse.ArgumentParser(description = "TalkNet Training")
    # Training details
    parser.add_argument('--lr',           type=float, default=0.0001,help='학습률')
    parser.add_argument('--lrDecay',      type=float, default=0.95,  help='학습률 감쇠율')
    parser.add_argument('--maxEpoch',     type=int,   default=30,    help='최대 epoch 수')
    parser.add_argument('--testInterval', type=int,   default=1,     help='모든 [testInterval] epoch 테스트 및 저장')
    parser.add_argument('--batchSize',    type=int,   default=3000,  help='Dynamic batch size')
    parser.add_argument('--nDataLoaderThread', type=int, default=4,  help='loader threads 수')
    # Data path
    parser.add_argument('--dataPath',  type=str, default="/data08/DATA", help='Save path of dataset')
    parser.add_argument('--savePath',     type=str, default="exps/exp1")
    # Data selection
    parser.add_argument('--evalDataType', type=str, default="val", help='to choose the dataset for evaluation, val or test')
    args = parser.parse_args()
    # Data loader
    args = init_args(args)

    loader = train_loader(trialFileName = args.trainTrial, \
                          audioPath      = os.path.join(args.audioPathDATA , 'train'), \
                          visualPath     = os.path.join(args.visualPathDATA, 'train'), \
                          **vars(args))
    trainLoader = torch.utils.data.DataLoader(loader, batch_size = 1, shuffle = True, num_workers = args.nDataLoaderThread)

    loader = val_loader(trialFileName = args.evalTrial, \
                        audioPath     = os.path.join(args.audioPathDATA , args.evalDataType), \
                        visualPath    = os.path.join(args.visualPathDATA, args.evalDataType), \
                        **vars(args))
    valLoader = torch.utils.data.DataLoader(loader, batch_size = 1, shuffle = False, num_workers = 16)


    modelfiles = glob.glob('%s/model_0*.model'%args.modelSavePath)
    modelfiles.sort()  
    if len(modelfiles) >= 1:
        print("Model %s loaded from previous state!"%modelfiles[-1])
        epoch = int(os.path.splitext(os.path.basename(modelfiles[-1]))[0][6:]) + 1
        s = talkNet(epoch = epoch, **vars(args))
        s.loadParameters(modelfiles[-1])
    else:
        epoch = 1
        s = talkNet(epoch = epoch, **vars(args))

    mAPs = []
    scoreFile = open(args.scoreSavePath, "a+")

    while(1):        
        loss, lr = s.train_network(epoch = epoch, loader = trainLoader, **vars(args))
        
        if epoch % args.testInterval == 0:        
            s.saveParameters(args.modelSavePath + "/model_%04d.model"%epoch)
            mAPs.append(s.evaluate_network(epoch = epoch, loader = valLoader, **vars(args)))
            print(time.strftime("%Y-%m-%d %H:%M:%S"), "%d epoch, mAP %2.2f%%, bestmAP %2.2f%%"%(epoch, mAPs[-1], max(mAPs)))
            scoreFile.write("%d epoch, LR %f, LOSS %f, mAP %2.2f%%, bestmAP %2.2f%%\n"%(epoch, lr, loss, mAPs[-1], max(mAPs)))
            scoreFile.flush()

        if epoch >= args.maxEpoch:
            quit()

        epoch += 1

if __name__ == '__main__':
    main()
