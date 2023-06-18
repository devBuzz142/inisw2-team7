import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.nn.init as init
from .box_utils import Detect, PriorBox


class L2Norm(nn.Module):

    def __init__(self, n_channels, scale):
        """
        초기화 함수

        인자:
            n_channels (int): 입력 텐서의 채널 수
            scale (float): 스케일 파라미터
        """
        super(L2Norm, self).__init__()
        self.n_channels = n_channels
        self.gamma = scale or None
        self.eps = 1e-10
        self.weight = nn.Parameter(torch.Tensor(self.n_channels))
        self.reset_parameters()

    def reset_parameters(self):
        # 가중치 파라미터를 초기화하는 함수
        init.constant_(self.weight, self.gamma)

    def forward(self, x):
        """
        순전파 함수

        인자:
            x (torch.Tensor): 입력 텐서

        반환값:
            out (torch.Tensor): 정규화된 텐서
        """
        norm = x.pow(2).sum(dim=1, keepdim=True).sqrt() + self.eps
        x = torch.div(x, norm)
        out = self.weight.unsqueeze(0).unsqueeze(2).unsqueeze(3).expand_as(x) * x
        return out


class S3FDNet(nn.Module):

    def __init__(self, device='cuda'):
        super(S3FDNet, self).__init__()
        self.device = device

        """
        S3FDNet 모델의 초기화 함수

        인자:
            device (str): 디바이스 설정. 기본값은 'cuda'.

        반환값:
            없음
        """

        # VGG 네트워크 정의
        self.vgg = nn.ModuleList([
            nn.Conv2d(3, 64, 3, 1, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 64, 3, 1, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),

            nn.Conv2d(64, 128, 3, 1, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(128, 128, 3, 1, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            
            nn.Conv2d(128, 256, 3, 1, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, 3, 1, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, 3, 1, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2, ceil_mode=True),
            
            nn.Conv2d(256, 512, 3, 1, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, 3, 1, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, 3, 1, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),

            nn.Conv2d(512, 512, 3, 1, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, 3, 1, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, 3, 1, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),

            nn.Conv2d(512, 1024, 3, 1, padding=6, dilation=6),
            nn.ReLU(inplace=True),
            nn.Conv2d(1024, 1024, 1, 1),
            nn.ReLU(inplace=True),
        ])

        # L2Norm 정규화 모듈
        self.L2Norm3_3 = L2Norm(256, 10)
        self.L2Norm4_3 = L2Norm(512, 8)
        self.L2Norm5_3 = L2Norm(512, 5)

        # 추가적인 컨볼루션 레이어
        self.extras = nn.ModuleList([
            nn.Conv2d(1024, 256, 1, 1),
            nn.Conv2d(256, 512, 3, 2, padding=1),
            nn.Conv2d(512, 128, 1, 1),
            nn.Conv2d(128, 256, 3, 2, padding=1),
        ])
        
        # 바운딩 박스 예측 레이어
        self.loc = nn.ModuleList([
            nn.Conv2d(256, 4, 3, 1, padding=1),
            nn.Conv2d(512, 4, 3, 1, padding=1),
            nn.Conv2d(512, 4, 3, 1, padding=1),
            nn.Conv2d(1024, 4, 3, 1, padding=1),
            nn.Conv2d(512, 4, 3, 1, padding=1),
            nn.Conv2d(256, 4, 3, 1, padding=1),
        ])

        # 클래스 신뢰도 예측 레이어
        self.conf = nn.ModuleList([
            nn.Conv2d(256, 4, 3, 1, padding=1),
            nn.Conv2d(512, 2, 3, 1, padding=1),
            nn.Conv2d(512, 2, 3, 1, padding=1),
            nn.Conv2d(1024, 2, 3, 1, padding=1),
            nn.Conv2d(512, 2, 3, 1, padding=1),
            nn.Conv2d(256, 2, 3, 1, padding=1),
        ])

        self.softmax = nn.Softmax(dim=-1)
        self.detect = Detect()

    def forward(self, x):
        """
        S3FDNet 모델의 forward 연산을 수행하는 함수

        인자:
            x (torch.Tensor): 입력 이미지 텐서

        반환값:
            output (torch.Tensor): 객체 탐지 결과
        """
        size = x.size()[2:]
        sources = list()
        loc = list()
        conf = list()

        # VGG 네트워크의 첫 부분을 통과
        for k in range(16):
            x = self.vgg[k](x)
        s = self.L2Norm3_3(x)
        sources.append(s)

        # VGG 네트워크의 중간 부분을 통과
        for k in range(16, 23):
            x = self.vgg[k](x)
        s = self.L2Norm4_3(x)
        sources.append(s)

        # VGG 네트워크의 마지막 부분을 통과
        for k in range(23, 30):
            x = self.vgg[k](x)
        s = self.L2Norm5_3(x)
        sources.append(s)

        for k in range(30, len(self.vgg)):
            x = self.vgg[k](x)
        sources.append(x)
        
        # 추가적인 컨볼루션 레이어 통과시키고 소스 레이어의 출력 결과를 저장
        for k, v in enumerate(self.extras):
            x = F.relu(v(x), inplace=True)
            if k % 2 == 1:
                sources.append(x)

        # 소스 레이어에 멀티박스 헤드 적용
        loc_x = self.loc[0](sources[0])
        conf_x = self.conf[0](sources[0])

        # 클래스 신뢰도 중에서 최댓값을 찾고, 배경 클래스를 제외한 나머지 클래스들을 하나로 통합
        max_conf, _ = torch.max(conf_x[:, 0:3, :, :], dim=1, keepdim=True)
        conf_x = torch.cat((max_conf, conf_x[:, 3:, :, :]), dim=1)

        loc.append(loc_x.permute(0, 2, 3, 1).contiguous())
        conf.append(conf_x.permute(0, 2, 3, 1).contiguous())

        for i in range(1, len(sources)):
            x = sources[i]
            conf.append(self.conf[i](x).permute(0, 2, 3, 1).contiguous())
            loc.append(self.loc[i](x).permute(0, 2, 3, 1).contiguous())

        # feature_maps 생성
        features_maps = []
        for i in range(len(loc)):
            feat = []
            feat += [loc[i].size(1), loc[i].size(2)]
            features_maps += [feat]

        # loc와 conf를 결합하여 최종 예측값 생성
        loc = torch.cat([o.view(o.size(0), -1) for o in loc], 1)
        conf = torch.cat([o.view(o.size(0), -1) for o in conf], 1)

        # PriorBox 생성
        with torch.no_grad():
            self.priorbox = PriorBox(size, features_maps)
            self.priors = self.priorbox.forward()

        # Detect 모듈을 통해 객체 탐지 결과 생성
        output = self.detect.forward(
            loc.view(loc.size(0), -1, 4),
            self.softmax(conf.view(conf.size(0), -1, 2)),
            self.priors.type(type(x.data)).to(self.device)
        )

        return output
