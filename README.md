# 화자탐지 자막배치 서비스 - WhoSpeak
<img src='https://github.com/devBuzz142/inisw2-team7/assets/19660039/67b6974a-75f1-450a-a89c-523deb51a351' width='720' />

## 개요
### 프로젝트 소개
`WhoSpeak`는 영상에서 화자를 인식하여 화자 주변에 자동으로 자막을 배치하는 서비스입니다.
- 음성텍스트변환 : WhisperX 모델을 사용하여 영상에서 자막 파일을 추출합니다.
- 얼굴인식     : S3FD 모델을 사용하여 영상의 각 프레임마다 얼굴을 탐지합니다.
- 화자탐지     : Light-ASD 모델을 사용하여 각 장면에 누가 화자인지 판별합니다.
- 자막배치     : 탐지된 화자 주변에 자막을 배치합니다.
- 자막수정     : 사용자가 자막의 위치와 내용을 추가적으로 수정할 수 있는 기능을 제공합니다.
위의 기능을 통해 사용자의 영상에서 화자 주변에 자막을 배치 및 편집할 수 있도록 합니다.

### 지능정보SW아카데미 2기 7조 팀원

| 김기연 | 김현명 | 박현규 | 이현우 | 정종관 | 제현재 | 황재남 |
| --- | --- | --- | --- | --- | --- | --- |
| <img src='https://github.com/devBuzz142/inisw2-team7/assets/19660039/8d0fcb90-d763-4d4b-944e-9a2f754a5ca2' width='150' />  | <img src='https://github.com/devBuzz142/inisw2-team7/assets/19660039/5d1bc503-f7f7-4214-8e8f-616e058c5a09' width='150' /> | <img src='https://github.com/devBuzz142/inisw2-team7/assets/19660039/7fb48c6f-57fa-4b67-864b-91ce05448fb7' width='150' /> | <img src='https://github.com/devBuzz142/inisw2-team7/assets/19660039/6b7a138e-37c3-4568-88bd-73ca15edfdef' width='150' /> | <img src='https://user-images.githubusercontent.com/97934878/176351807-7934715a-17c7-4efd-84d1-713c45af5794.png' width='150' />  | <img src='https://github.com/devBuzz142/inisw2-team7/assets/19660039/9d66ac4a-b2be-43d2-9a8b-31d6556a0d94' width='150' /> | <img src='https://github.com/devBuzz142/inisw2-team7/assets/19660039/eb4f82c1-df5d-4466-9e93-b8173f2e1c57' width='150' /> |

<br>


## 프로젝트 구조

### 플로우 차트
<img width="594" alt="image" src="https://github.com/devBuzz142/inisw2-team7/assets/19660039/14a13e3f-041a-4afe-a2c6-05ed68405dc8">


### 서비스 구성
| 페이지 | 뷰 | 기능 |
|---|---|---|
| Home | <img width="720" alt="image" src="https://github.com/devBuzz142/inisw2-team7/assets/19660039/6b9ae571-2657-406c-b9bc-05eb3a95f346"> | - 자막 언어 선택<br> - 동영상 업로드 |
| Edit | <img width="720" alt="image" src="https://github.com/devBuzz142/inisw2-team7/assets/19660039/e59ddcfa-67f0-49c2-8321-2224d785281b"> | - <b>자동 자막 배치</b> <br> - 자막 수정<br> - 자막 합성 |
| Result | <img width="720" alt="image" src="https://github.com/devBuzz142/inisw2-team7/assets/19660039/b01596a0-39c2-4a69-be6a-e03bdc43df14"> | - 영상 다운로드 |


### 기술 스택

<img width='720' src='https://github.com/devBuzz142/inisw2-team7/assets/19660039/47de13f8-38b5-465a-9255-d50b58659bf3' />


<br>

## 기타
### 실행방법

깃 레포 다운로드
```
git clone https://github.com/devBuzz142/inisw2-team7.git
```
- ./fe : 프론트엔드 폴더
- ./server/whospeak : 서버 및 모델 구동 폴더
- ./Light-ASD : 화자탐지 모델 폴더

FE 실행방법
```
// @inisw2-team7
cd fe
yarn add // npm install
yarn dev // npm run dev
// run on localhost:5137
```

BE && Model 실행방법
1. https://imagemagick.org/script/download.php 에서 환경에 따른 ‘ImageMagick.exe’ 다운 → 자막합성시 TextClip 불러오는데 필요
2. 패키지 설치
```
// @inisw2-team7
pip install -r requirement.txt
```
3. whisperX 다운
```
pip install git+https://github.com/m-bain/whisperx.git
```
4. 서버 실행
```
@ /inisw2-team7
cd server/whospeak
python manage.py runserver
// run on localhost:8000
```
