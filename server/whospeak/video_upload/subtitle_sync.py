# 라이브러리 import
from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip
from moviepy.video.tools.subtitles import SubtitlesClip
from googletrans import Translator
from langdetect import detect
import numpy as np
import codecs
import pickle
import argparse
import os
import json
import time

from moviepy.config import change_settings
change_settings({"IMAGEMAGICK_BINARY": r"C:\Program Files\ImageMagick-7.1.1-Q16-HDRI\\magick.exe"})

translator = Translator()

print("=" * 50)
print()
print('subtitle_sync 실행 중...')
startT = time.time()

# argparse를 사용하여 동영상 파일 이름을 입력으로 받음
parser = argparse.ArgumentParser(description = "video Name")
parser.add_argument('--videoName', type=str, default='001')    # 비디오 이름
parser.add_argument('--language', type=str, default='ko')     # 타겟 언어
args = parser.parse_args()
file_nm = args.videoName.split('.')[0]

# 자막 파일 경로
srt_path = os.path.join(os.pardir, 'media', 'srt', f'{file_nm}.srt')
# 동영상 파일 경로
video_path = os.path.join(os.pardir, 'media', 'videos', file_nm , 'pyavi', 'video_out.avi')
# 동영상 로드
video = VideoFileClip(video_path)
# 원하는 추출 언어
output_lang = args.language
# 얼굴 pickle 파일
face_score = os.path.join(os.pardir, 'media', 'videos', file_nm , 'pywork', 'scoring.pckl')

# pickle 파일 읽기
with open(face_score, 'rb') as f:
    faces_score = pickle.load(f)

# srt 파일 읽기
try:
    with codecs.open(srt_path, 'r', 'utf-8') as file:
        lines = file.readlines()
except:
    with codecs.open(srt_path, 'r', 'cp949') as file:
        lines = file.readlines()

# srt파일의 시간을 초단위로 변경하는 함수
def time_to_seconds(time_str):
    h, m, s = map(float, time_str.split(':'))
    seconds = h * 3600 + m * 60 + s
    return seconds

# 번역함수
def translate(text, target='ko'):
    # do not translate if text is Korean.
    if detect(text) == target:
        return text

    try:
        result = translator.translate(text, str(target)).text
    except Exception as e:
        print(f"Translation error: {e}")
        result = text
    return result

# 자막이 화면 밖으로 나가는 것을 방지하는 함수
def prevent_out(x, y, video, subtitles_clip):
    xx = min(max(0.02*video.w, x), 0.98*video.w - subtitles_clip.w)
    yy = min(max(0.02*video.h, y), 0.98*video.h - subtitles_clip.h)
    return xx, yy

# l2_norm 함수
def l2_norm(vector):
    squared_sum = np.sum(np.square(vector))
    norm = np.sqrt(squared_sum)
    return norm


# 자막이 배치된 리스트
subtitles_clip = []
# 화자 기준 자막 배치 위치 리스트
po_loc = []
point_loc = []
# 위치 중점 리스트
pointmid_loc = []
# 화자 tracking 리스트
po_tra = []
# 추출할 pickle 파일
out_pickle = []


k = 2
while k < len(lines):
    # 두명의 화자가 말할때
    if lines[k+2][:2] == '--':
        line_2 = lines[k+2].replace('-','').strip() +'\n' + lines[k+3].replace('-','').strip()
        # srt파일에서 자막의 시작시간과 끝 시간을 뽑아주는 함수
        start_time, end_time = lines[k + 1].strip().replace('\r','').split(' --> ')
        text = line_2.strip()
        k+=5
        #print('ddddddddd')
        
    else:
        # srt파일에서 자막의 시작시간과 끝 시간을 뽑아주는 함수
        #print(k)
        start_time, end_time = lines[k + 1].strip().replace('\r','').split(' --> ')
        text = lines[k + 2].strip()
        k+=4
    
    # 자막 생성 안되었을 경우 에러 방지
    if text == '':
        continue
        
    # 원하는 언어로 자막 번역
    text = translate(text, str(output_lang))
    
    # 자막 길면 줄바꿈
    if len(text) > 30:
        for i in range(30, 0, -1):
            if text[i] == ' ':
                text = text[:i]+'\n'+text[i+1:]
                break
    
    # 자막을 배치
    if output_lang == 'ko':
        font = 'Malgun-Gothic'
    else:
        font = 'Arial-Unicode-MS'

    text_clip = (
        TextClip(text, fontsize=24, color='white', font=font)
        .set_position(("center", "bottom"))
        .set_start(start_time)
        .set_end(end_time)
    )
    
    start = int(time_to_seconds(start_time.replace(',','.'))*video.fps) # 초 * 프레임 (ex: 3초부분 , 25 프레임 => 75)
    end = int(time_to_seconds(end_time.replace(',','.'))*video.fps)
    # 자막이 나오는 중간 시간 기준
    mid = int((start+end)//2)
    # score 기준으로 정렬
    top_face = sorted(faces_score[mid], key=lambda x: x['기
                        norm_lst = dis_lst/norm
                        
                        # 점의 lcoal energy
                        elocal = 0
                        for d in norm_lst:
                            elocal += np.exp(-10 * d**2)*d*norm
                        
                        # 점의 global energy
                        eglo = (((pointmid_lst[-1][0] - x)**2 + (pointmid_lst[-1][1] - y)**2)**0.5)/norm
                        
                        # 점의 layout energy
                        elay = max(x, y, video.w - x, video.h - y)/norm
                        elst.append(elocal+eglo-0.01*elay)
                
                # energy 합이 가장 작은 후보 찾기
                loc = 0
                for i in elst:
                    if i == min(elst):
                        break
                    loc += 1
                
                # 그 후보에 자막 배치
                text_clip = text_clip.set_position([plist_p[loc][0], plist_p[loc][1]])
                
                # 모든 후보에 bbox가 겹칠 경우 아래에 자막 배치        
                if sub_change2 == [True, True, True, True, True]:
                    text_clip = text_clip.set_position((0.5*video.w - 0.5*text_clip.w, 0.95*video.h - text_clip.h))
                    point_loc.append((0.5*video.w - 0.5*text_clip.w, 0.95*video.h - text_clip.h))
                else:
                    # x1, y2 값을 리스트에 추가
                    point_loc.append((plist_p[loc][0], plist_p[loc][1]))
        
        # 이전 자막과 현재 자막의 화자가 같은데 자막 후보의 위치가 다른 경우 현재 자막 후보 위치로 이전 자막 후보의 위치를 변경
        for i in range(len(po_loc)-1, -1, -1):
            if (po_loc[i] != loc) and (po_tra[i] == [d['track'] for d in top_face][0]):
                subtitles_clip[i] = subtitles_clip[i].set_position(point_loc[i+1]) # 바꾼부분
                point_loc[i] = point_loc[i+1] # 바꾼부분
            else:
                break
    
    # tracking을 통해 자막의 화자가 누군지 리스트에 추가
    if [d['track'] for d in top_face] == []:
        po_tra.append(None)
    else:
        po_tra.append([d['track'] for d in top_face][0])
    po_loc.append(loc)
    
    pointmid_loc.append((point_loc[-1][0]+0.5*text_clip.w, point_loc[-1][1]+0.5*text_clip.h))
    out_pickle.append({'start_frame': start, 'end_frame': end, 'pos': point_loc[-1], 'text': text, 'start_time': start_time, 'end_time': end_time})
    subtitles_clip.append(text_clip)

output_path = os.path.join(os.pardir, 'media', 'mid_json', f'{file_nm}.json')

with open(output_path, 'w') as f:
    out_json = { 'data' : out_pickle }
    json.dump(out_json, f, indent = 4)

endT = time.time()

print()
print('subtitle_sync 실행 완료')
print(f"🕒걸린 시간 : {endT - startT:.2f} sec")
print()
