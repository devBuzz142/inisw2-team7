import os, subprocess, glob, pandas, tqdm, cv2, numpy
from scipy.io import wavfile

def init_args(args):
    # The details for the following folders/files can be found in the annotation of the function 'preprocess_AVA' below
    args.modelSavePath    = os.path.join(args.savePath, 'model')
    args.scoreSavePath    = os.path.join(args.savePath, 'score.txt')
    args.trialPathAVA     = os.path.join(args.dataPathAVA, 'csv')
    args.audioOrigPathAVA = os.path.join(args.dataPathAVA, 'orig_audios')
    args.visualOrigPathAVA= os.path.join(args.dataPathAVA, 'orig_videos')
    args.audioPathAVA     = os.path.join(args.dataPathAVA, 'clips_audios')
    args.visualPathAVA    = os.path.join(args.dataPathAVA, 'clips_videos')
    args.trainTrialAVA    = os.path.join(args.trialPathAVA, 'train_loader.csv')
    '''
    데이터 저장 및 접근 경로 설정.
    '''

    if args.evalDataType == 'val':
        args.evalTrialAVA = os.path.join(args.trialPathAVA, 'val_loader.csv')
        args.evalOrig     = os.path.join(args.trialPathAVA, 'val_orig.csv')  
        args.evalCsvSave  = os.path.join(args.savePath,     'val_res.csv') 
    else:
        args.evalTrialAVA = os.path.join(args.trialPathAVA, 'test_loader.csv')
        args.evalOrig     = os.path.join(args.trialPathAVA, 'test_orig.csv')    
        args.evalCsvSave  = os.path.join(args.savePath,     'test_res.csv')
    '''
    evaluation단계에서 valiadation / test set 중 어느것에 대해 평가할지 결정한다.
    각 경우에 따라 path를 설정하여 csv파일을 달리 참조하게 한다.
    '''


    os.makedirs(args.modelSavePath, exist_ok = True)
    os.makedirs(args.dataPathAVA, exist_ok = True)
    '''
    설정된 args의 path값에 따라 폴더를 생성한다.
    모델 저장 경로, 데이터 저장 경로
    '''

    return args


def preprocess_AVA(args):
    # This preprocesstion is modified based on this [repository](https://github.com/fuankarion/active-speakers-context).
    # The required space is 302 G. 
    # If you do not have enough space, you can delate `orig_videos`(167G) when you get `clips_videos(85G)`.
    #                             also you can delate `orig_audios`(44G) when you get `clips_audios`(6.4G).
    # So the final space is less than 100G.
    # The AVA dataset will be saved in 'AVApath' folder like the following format:
    # ```
    # ├── clips_audios  (The audio clips cut from the original movies)
    # │   ├── test
    # │   ├── train
    # │   └── val
    # ├── clips_videos (The face clips cut from the original movies, be save in the image format, frame-by-frame)
    # │   ├── test
    # │   ├── train
    # │   └── val
    # ├── csv
    # │   ├── test_file_list.txt (name of the test videos)
    # │   ├── test_loader.csv (The csv file we generated to load data for testing)
    # │   ├── test_orig.csv (The combination of the given test csv files)
    # │   ├── train_loader.csv (The csv file we generated to load data for training)
    # │   ├── train_orig.csv (The combination of the given training csv files)
    # │   ├── trainval_file_list.txt (name of the train/val videos)
    # │   ├── val_loader.csv (The csv file we generated to load data for validation)
    # │   └── val_orig.csv (The combination of the given validation csv files)
    # ├── orig_audios (The original audios from the movies)
    # │   ├── test
    # │   └── trainval
    # └── orig_videos (The original movies)
    #     ├── test
    #     └── trainval
    # ```

    download_csv(args) # Take 1 minute 
    download_videos(args) # Take 6 hours
    extract_audio(args) # Take 1 hour
    extract_audio_clips(args) # Take 3 minutes
    extract_video_clips(args) # Take about 2 days
    '''
    download : csv -> video
    extract : video -> audio
    extract clipt : audio -> audio clip, video -> video_clip
    '''

def download_csv(args): 
    # Take 1 minute to download the required csv files
    Link = "1C1cGxPHaJAl1NQ2i7IhRgWmdvsPhBCUy"
    cmd = "gdown --id %s -O %s"%(Link, args.dataPathAVA + '/csv.tar.gz')
    subprocess.call(cmd, shell=True, stdout=None)
    '''
    gdown : 구글 드라이브에서 다운로드 하는 명령어
        --id : id에 해당하는 저장소에서 다운로드
        -O : 다운로드 받은 파일을 저장할 이름

    id가 Link에 저장된 값 1C1cGxPHaJAl1NQ2i7IhRgWmdvsPhBCUy인 구글드라이브에서 파일을 저장받아
    args.dataPathAVA/csv.tar.gz로 저장하는 명령어를
    cmd에 string으로 저장한다.

    해당 cmd를 subprocess.call을 통해 shell에서 실행한다.
    '''

    cmd = "tar -xzvf %s -C %s"%(args.dataPathAVA + '/csv.tar.gz', args.dataPathAVA)
    subprocess.call(cmd, shell=True, stdout=None)
    os.remove(args.dataPathAVA + '/csv.tar.gz')
    '''
    다운로드 받은 파일 (args.dataPathAVA/csv.tar.gz)를 압축해제한다.
    압축해제한 파일은 args.dataPathAVA에 저장되며, 원본 파일은 삭제한다.

    압축 해제 결과
    # ├── csv
    # │   ├── test_file_list.txt (name of the test videos)
    # │   ├── test_loader.csv (The csv file we generated to load data for testing)
    # │   ├── test_orig.csv (The combination of the given test csv files)
    # │   ├── train_loader.csv (The csv file we generated to load data for training)
    # │   ├── train_orig.csv (The combination of the given training csv files)
    # │   ├── trainval_file_list.txt (name of the train/val videos)
    # │   ├── val_loader.csv (The csv file we generated to load data for validation)
    # │   └── val_orig.csv (The combination of the given validation csv files)
    '''


def download_videos(args): 
    # Take 6 hours to download the original movies, follow this repository: https://github.com/cvdfoundation/ava-dataset
    for dataType in ['trainval', 'test']:
        fileList = open('%s/%s_file_list.txt'%(args.trialPathAVA, dataType)).read().splitlines()   
        outFolder = '%s/%s'%(args.visualOrigPathAVA, dataType)
        '''
        dataset파일경로로부터 download_csv를 통해 받은 file_list.txt를 읽어와서, splitlines를 통해 list로 저장한다.

        trainval_file_list.txt
            5milLu-6bWI.mp4
            2fwni_Kjf2M.mkv
            VsYPP2I0aUQ.mkv
            o4xQ-BEa3Ss.mkv
            Kb1fduj-jdY.mp4
            uzPI7FcF79U.mkv
            l-jxh8gpxuY.mkv
            ...
        식으로 저장되어 있다.

        이것을 읽어와 splitlines하면
        fileList = ['5milLu-6bWI.mp4', '2fwni_Kjf2M.mkv', ...] 식으로 저장된다.

        최종적으로 다운로드한 비디오는 outFolder 경로에 저장된다.
        '''

        for fileName in fileList:
            # keep fileName of downloaded files into text file
            with open('%s/%s_file_list.txt'%(args.visualOrigPathAVA, dataType), 'a') as f:
                # from f, find fileName, if fileName is not in f, write fileName into f
                if fileName not in open('%s/%s_file_list.txt'%(args.visualOrigPathAVA, dataType)).read():
                    cmd = "wget -P %s https://s3.amazonaws.com/ava-dataset/%s/%s"%(outFolder, dataType, fileName)
                    subprocess.call(cmd, shell=True, stdout=None)
                    f.write(fileName + '\n')
                    '''
                    AVA/visual_orig/trainval/trainval_file_list.txt을 생성하거나 열어서
                    fileName이 있는지 없는지 검사하고
                    비디오 다운로드 하고
                    fileName을 trainval_file_list.txt에 추가한다.

                    근데 왜 파일이 안보이지..?
                    '''

def extract_audio(args):
    # Take 1 hour to extract the audio from movies
    for dataType in ['trainval', 'test']:
        inpFolder = '%s/%s'%(args.visualOrigPathAVA, dataType)
        outFolder = '%s/%s'%(args.audioOrigPathAVA, dataType)
        os.makedirs(outFolder, exist_ok = True)
        '''
        orig_video에서 비디오 파일을 불러와서
        orig_audio에 저장한다.
        '''

        videos = glob.glob("%s/*"%(inpFolder))
        '''
        경로로부터 모든 파일(*)을 불러와서 list형태로 저장한다.
        '''

        for videoPath in tqdm. ptqdm(videos):
            '''
            video list에서 video를 하나씩 videoPath라는 이름으로 순회힌다.
            '''
            audioPath = '%s/%s'%(outFolder, videoPath.split('/')[-1].split('.')[0] + '.wav')
            cmd = ("ffmpeg -y -i %s -async 1 -ac 1 -vn -acodec pcm_s16le -ar 16000 -threads 8 %s -loglevel panic" % (videoPath, audioPath))
            subprocess.call(cmd, shell=True, stdout=None)
            '''
            ffpmeg를 통해 비디오에서 오디오를 추출한다.
            -y : 덮어쓰기
            -i : input file (videoPath)
            -async 1 : 오디오와 비디오를 동시에 재생할 수 있도록 한다
            -ac 1 : 오디오 채널을 1로 설정한다. 모노 오디오.
            -vn : 비디오를 무시한다. 오디오 스트림만 처리한다.
            -acodec : 오디오 코덱을 설정한다. pcm_s16le은 16비트 리틀 엔디언 PCM 오디오를 사용한다.
            -ar : 오디오 샘플링 레이트를 설정한다. 16000Hz로 설정한다.
            -threads : 쓰레드 수를 설정한다. 8개로 설정한다.
            -loglevel : 로그 레벨을 설정한다. panic 레벨을 지정하여 가장 낮은 로그 레벨로 설정하고, 에러 및 경고 메시지를 출력하지 않도록 합니다.
            '''



def extract_audio_clips(args):
    # Take 3 minutes to extract the audio clips
    dic = {'train':'trainval', 'val':'trainval', 'test':'test'}
    for dataType in ['train', 'val', 'test']:
        df = pandas.read_csv(os.path.join(args.trialPathAVA, '%s_orig.csv'%(dataType)), engine='python')
        '''
        train, val, test의 csv파일을 읽어와 pandas dataframe으로 저장한다.
        '''

        dfNeg = pandas.concat([df[df['label_id'] == 0], df[df['label_id'] == 2]])
        dfPos = df[df['label_id'] == 1]
        insNeg = dfNeg['instance_id'].unique().tolist()
        insPos = dfPos['instance_id'].unique().tolist()
        '''
        df['label'].unique()
        -> array(['NOT_SPEAKING', 'SPEAKING_AUDIBLE', 'SPEAKING_NOT_AUDIBLE'], dtype=object)
        '''

        df = pandas.concat([dfPos, dfNeg]).reset_index(drop=True)
        df = df.sort_values(['entity_id', 'frame_timestamp']).reset_index(drop=True)
        entityList = df['entity_id'].unique().tolist()
        df = df.groupby('entity_id')
        audioFeatures = {}
        outDir = os.path.join(args.audioPathAVA, dataType)
        audioDir = os.path.join(args.audioOrigPathAVA, dic[dataType])
        for l in df['video_id'].unique().tolist():
            d = os.path.join(outDir, l[0])
            if not os.path.isdir(d):
                os.makedirs(d)
        for entity in tqdm.tqdm(entityList, total = len(entityList)):
            insData = df.get_group(entity)
            '''
            entity_id에 해당하는 group의 series들을 insData에 df형태로 저장한다.
            '''

            videoKey = insData.iloc[0]['video_id'] 
            start = insData.iloc[0]['frame_timestamp']
            end = insData.iloc[-1]['frame_timestamp']
            entityID = insData.iloc[0]['entity_id']
            insPath = os.path.join(outDir, videoKey, entityID+'.wav')

            if videoKey not in audioFeatures.keys():                
                audioFile = os.path.join(audioDir, videoKey+'.wav')
                sr, audio = wavfile.read(audioFile)
                audioFeatures[videoKey] = audio
            audioStart = int(float(start)*sr)
            audioEnd = int(float(end)*sr)
            audioData = audioFeatures[videoKey][audioStart:audioEnd]
            wavfile.write(insPath, sr, audioData)

def extract_video_clips(args):
    # Take about 2 days to crop the face clips.
    # You can optimize this code to save time, while this process is one-time.
    # If you do not need the data for the test set, you can only deal with the train and val part. That will take 1 day.
    # This procession may have many warning info, you can just ignore it.
    dic = {'train':'trainval', 'val':'trainval', 'test':'test'}
    for dataType in ['train', 'val', 'test']:
        df = pandas.read_csv(os.path.join(args.trialPathAVA, '%s_orig.csv'%(dataType)))
        dfNeg = pandas.concat([df[df['label_id'] == 0], df[df['label_id'] == 2]])
        dfPos = df[df['label_id'] == 1]
        insNeg = dfNeg['instance_id'].unique().tolist()
        insPos = dfPos['instance_id'].unique().tolist()

        df = pandas.concat([dfPos, dfNeg]).reset_index(drop=True)
        df = df.sort_values(['entity_id', 'frame_timestamp']).reset_index(drop=True)
        '''
        entity_it, frame_timestamp 순으로 정렬한다. index 리셋하고 삭제
        '''

        entityList = df['entity_id'].unique().tolist()
        df = df.groupby('entity_id')
        '''
        unique를 통해 entity_id list를 추출한다. (box entity id)
        entity_id를 기준으로 그룹화한다. (박스 단위)
        '''

        outDir = os.path.join(args.visualPathAVA, dataType)
        audioDir = os.path.join(args.visualOrigPathAVA, dic[dataType])
        for l in df['video_id'].unique().tolist():
            d = os.path.join(outDir, l[0])
            if not os.path.isdir(d):
                os.makedirs(d)
        for entity in tqdm.tqdm(entityList, total = len(entityList)):
            insData = df.get_group(entity)
            videoKey = insData.iloc[0]['video_id']
            entityID = insData.iloc[0]['entity_id']
                
            videoDir = os.path.join(args.visualOrigPathAVA, dic[dataType])
            videoFile = glob.glob(os.path.join(videoDir, '{}.*'.format(videoKey)))[0] # 비디오 파일 경로

            V = cv2.VideoCapture(videoFile) # 비디오 경로로부터 비디오 받고
            insDir = os.path.join(os.path.join(outDir, videoKey, entityID))
            if not os.path.isdir(insDir):
                os.makedirs(insDir)

            for _, row in insData.iterrows():
                imageFilename = os.path.join(insDir, str("%.2f"%row['frame_timestamp'])+'.jpg')
                '''
                clip_video/dataType/videoKey/entityID/row['frame_timestamp'].jpg
                '''

                V.set(cv2.CAP_PROP_POS_MSEC, row['frame_timestamp'] * 1e3)
                _, frame = V.read()
                '''
                프레임별로 쪼갬. 1*e3
                '''

                h = numpy.size(frame, 0)
                w = numpy.size(frame, 1)
                x1 = int(row['entity_box_x1'] * w)
                y1 = int(row['entity_box_y1'] * h)
                x2 = int(row['entity_box_x2'] * w)
                y2 = int(row['entity_box_y2'] * h)
                face = frame[y1:y2, x1:x2, :] # frame에서 face croping
                cv2.imwrite(imageFilename, face)