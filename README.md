# 화자탐지 자막배치 서비스 - WhoSpeak
<img src='https://github.com/devBuzz142/inisw2-team7/assets/19660039/67b6974a-75f1-450a-a89c-523deb51a351' width='720' />

## 개요
### 프로젝트 소개
`WhoSpeak`는 영상에서 화자를 인식하여 화자 주변에 자동으로 자막을 배치하는 서비스입니다.
- 음성텍스트변환 : WhisperX 모델을 사용하여 영상에서 자막 파일을 추출합니다.
- 얼굴인식     : S3FD 모델을 사용하여 영상의 각 프레임마다 얼굴을 탐지합니다.
- 화자탐지     : Light-ASD 모델을 사용하여 각 장면에 누가 화자인지 판별합니다.
- 자막배치     : 탐지된 화자 주변에 자막을 배치합니다. 

### 실행방법
```
git clone https://github.com/devBuzz142/inisw2-team7.git
cd inisw2-team7

// fe 실행방법
cd fe   // cd ~path/inisw-team7/fe
yarn add // npm install
yarn dev // npm run dev
// run on localhost:5137

// be && model 실행방법

```

### 지능정보SW아카데미 2기 7조 팀원

| 김기연 | 김현명 | 박현규 | 이현우 | 정종관 | 제현재 | 황재남 |
| --- | --- | --- | --- | --- | --- | --- |
|   |  |  |  | <img src='https://user-images.githubusercontent.com/97934878/176351807-7934715a-17c7-4efd-84d1-713c45af5794.png' width='150' />  | |  |

<br>

## 프로젝트 구조

### 플로우

### 아키텍처

### 기술 스택

## 시연 화면

### 데모 영상

### 사진

### 사용 방법
