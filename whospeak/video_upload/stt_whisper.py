import whisperx
import gc 
import ffmpeg
import datetime
import os
import argparse
import time

class VideoTranscriber:
    def __init__(self, video_name, device="cuda", batch_size=4, compute_type="int8"):
        # 비디오 이름, 디바이스, 배치 사이즈, 계산 유형을 초기화.
        self.video_name = video_name
        self.file_nm = video_name.split('.')[0]
        self.device = device
        self.batch_size = batch_size
        self.compute_type = compute_type
        self.audio_file = os.path.join(os.pardir, 'media', 'videos', self.file_nm, 'pyavi', 'audio.wav')

        # Whisperx 모델 로드
        self.model = whisperx.load_model(r"medium", device, compute_type=compute_type)

        # 지정한 오디오 파일을 로드
        self.audio = whisperx.load_audio(self.audio_file)

        # 음성을 텍스트로 변환
        self.result = self.model.transcribe(self.audio, batch_size=batch_size)

        # 각 텍스트 세그먼트의 정확한 시작/끝 시간을 찾기 위해 align 모델을 불러오고 적용
        self.model_a, self.metadata = whisperx.load_align_model(language_code=self.result["language"], device=device)
        self.result = whisperx.align(self.result["segments"], self.model_a, self.metadata, self.audio, device, return_char_alignments=False)

    @staticmethod
    def format_time_exact(seconds):
        # 초 단위의 시간을 SRT 형식으로 변환하는 함수
        duration = datetime.timedelta(seconds=seconds)
        hours = duration.seconds // 3600
        minutes = (duration.seconds % 3600) // 60
        seconds = duration.seconds % 60
        milliseconds = duration.microseconds // 1000

        time_str = "{:02d}:{:02d}:{:02d},{:03d}".format(hours, minutes, seconds, milliseconds)
        return time_str

    def generate_srt_text(self):
        # SRT 형식의 텍스트를 생성하는 함수
        srt_text = ""
        segment_number = 1

        for segment in self.result["segments"]:
            start_time = segment["start"]
            end_time = segment["end"]
            text = segment["text"]

            start_time_str = self.format_time_exact(start_time)
            end_time_str = self.format_time_exact(end_time)

            srt_text += f"{segment_number}\n{start_time_str} --> {end_time_str}\n{text}\n\n"
            segment_number += 1

        return srt_text

    def save_srt_text(self):
        # 생성한 SRT 텍스트를 파일로 저장하는 함수
        srt_text = self.generate_srt_text()
        output_file_path = f"../media/srt/{args.videoName.split('.')[0]}.srt"
        with open(output_file_path, "w", encoding="utf-8") as f:
            f.write(srt_text)


if __name__ == "__main__":
    print("=" * 50)
    print()
    print('Whisper STT 실행 중...')
    start = time.time()
    # argparse를 사용하여 동영상 파일 이름을 입력으로 받음
    parser = argparse.ArgumentParser(description = "video Name")
    parser.add_argument('--videoName', type=str, default='exam')
    args = parser.parse_args()
    
    # VideoTranscriber 클래스의 인스턴스를 생성
    # 이 때, 사용자가 입력한 동영상 파일의 이름을 인자로 전달
    transcriber = VideoTranscriber(args.videoName)

    # 음성을 텍스트로 변환한 결과를 SRT 형식의 텍스트로 변환하고, 이를 파일로 저장
    transcriber.save_srt_text()

    end = time.time()

    print()
    print('Whisper STT 실행 완료')
    print(f"🕒걸린 시간 : {end - start:.2f} sec")
    print()
