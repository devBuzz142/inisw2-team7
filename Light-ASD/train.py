import time, os, torch, argparse, warnings, glob   
from dataLoader import train_loader, val_loader    
from utils.tools import *                           
from ASD import ASD                                

def main():  
    warnings.filterwarnings("ignore")  

    parser = argparse.ArgumentParser(description = "Model Training") 
    
    parser.add_argument('--lr', type=float, default=0.001)              # 학습률
    parser.add_argument('--lrDecay', type=float, default=0.95)          # 학습률 감소율
    parser.add_argument('--maxEpoch', type=int, default=35)             # 최대 에포크
    parser.add_argument('--testInterval', type=int, default=1)          # 테스트 간격
    parser.add_argument('--batchSize', type=int, default=2500)          # 배치 사이즈
    parser.add_argument('--nDataLoaderThread', type=int, default=64)    # 데이터 로드에 사용되는 스레드 수
    parser.add_argument('--dataPath', type=str, default="DataPath")     # 데이터 경로
    parser.add_argument('--savePath', type=str, default="exps/exp1")    # 모델 저장 경로
    parser.add_argument('--evalDataType', type=str, default="val")      # 평가 데이터 타입

    args = parser.parse_args()  # 입력받은 인자를 파싱
    args = init_args(args)      # 입력받은 인자를 초기화하는 함수를 호출

    # 훈련 데이터 로더
    loader = train_loader(trialFileName = args.trainTrial, \
                          audioPath      = os.path.join(args.audioPathDATA , 'train'), \
                          visualPath     = os.path.join(args.visualPathDATA, 'train'), \
                          **vars(args))
    trainLoader = torch.utils.data.DataLoader(loader, batch_size = 1, shuffle = True, num_workers = args.nDataLoaderThread, pin_memory = True)

    # 검증 데이터 로더
    loader = val_loader(trialFileName = args.evalTrial, \
                        audioPath     = os.path.join(args.audioPathDATA , args.evalDataType), \
                        visualPath    = os.path.join(args.visualPathDATA, args.evalDataType), \
                        **vars(args))
    valLoader = torch.utils.data.DataLoader(loader, batch_size = 1, shuffle = False, num_workers = 64, pin_memory = True)

    # 이전에 학습된 모델이 있는지 확인
    modelfiles = glob.glob('%s/model_0*.model'%args.modelSavePath)
    modelfiles.sort()  
    if len(modelfiles) >= 1:
        # 이전에 학습된 모델이 있다면, 가장 최근의 것을 load
        print("Model %s loaded from previous state!"%modelfiles[-1])
        epoch = int(os.path.splitext(os.path.basename(modelfiles[-1]))[0][6:]) + 1
        s = ASD(epoch = epoch, **vars(args))
        s.loadParameters(modelfiles[-1])
    else:
        # 이전에 학습된 모델이 없다면, 새로운 모델을 생성
        epoch = 1
        s = ASD(epoch = epoch, **vars(args))

    mAPs = []  # 평균 정밀도를 저장할 리스트를 초기화.
    scoreFile = open(args.scoreSavePath, "a+")  

    while(1):        
        # 네트워크를 학습
        loss, lr = s.train_network(epoch = epoch, loader = trainLoader, **vars(args))
        
        if epoch % args.testInterval == 0:        
            # 테스트 간격마다 모델을 저장하고, 네트워크를 평가
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
