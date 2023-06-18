import torch
import torch.nn as nn

from model.Classifier import BGRU
from model.Encoder import visual_encoder, audio_encoder

class ASD_Model(nn.Module):
    def __init__(self):
        super(ASD_Model, self).__init__()
        
        self.visualEncoder  = visual_encoder()  # 시각적 정보를 인코딩하는 visual_encoder 클래스의 인스턴스를 생성
        self.audioEncoder  = audio_encoder()    # 오디오 정보를 인코딩하는 audio_encoder  클래스의 인스턴스를 생성
        self.GRU = BGRU(128)                    # 오디오 및 시각적 정보를 통합하기 위해 BGRU를 사용

    def forward_visual_frontend(self, x):
        # 시각적 피쳐의 차원을 조정하고 정규화
        B, T, W, H = x.shape  
        x = x.view(B, 1, T, W, H)
        x = (x / 255 - 0.4161) / 0.1688
        x = self.visualEncoder(x)
        return x

    def forward_audio_frontend(self, x): 
        # 오디오 피쳐의 차원을 조정하고 오디오 인코더를 통해 전달   
        x = x.unsqueeze(1).transpose(2, 3)     
        x = self.audioEncoder(x)
        return x

    def forward_audio_visual_backend(self, x1, x2):  
        # 오디오 및 시각적 임베딩을 통합하고, GRU를 통해 전달
        x = x1 + x2 
        x = self.GRU(x)   
        x = torch.reshape(x, (-1, 128))
        return x    

    def forward_visual_backend(self,x):
        # 시각적 임베딩의 차원을 조정
        x = torch.reshape(x, (-1, 128))
        return x

    def forward(self, audioFeature, visualFeature):
        # 오디오 피쳐와 시각적 피쳐를 각각 인코딩
        audioEmbed = self.forward_audio_frontend(audioFeature)
        visualEmbed = self.forward_visual_frontend(visualFeature)

        # 오디오-시각 임베딩과 시각적 임베딩을 각각 백엔드 처리 
        outsAV = self.forward_audio_visual_backend(audioEmbed, visualEmbed)  
        outsV = self.forward_visual_backend(visualEmbed)

        return outsAV, outsV