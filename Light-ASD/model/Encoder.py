import torch
import torch.nn as nn

# Audio_Block 정의
class Audio_Block(nn.Module):
    def __init__(self, in_channels, out_channels):
        super(Audio_Block, self).__init__()

        self.relu = nn.ReLU()

        # 2차원 컨볼루션 레이어를 선언. 
        # 배치 정규화 적용
        # bias = 사용 X
        self.m_3 = nn.Conv2d(in_channels, out_channels, kernel_size = (3, 1), padding = (1, 0), bias = False)
        self.bn_m_3 = nn.BatchNorm2d(out_channels, momentum = 0.01, eps = 0.001)    
        self.t_3 = nn.Conv2d(out_channels, out_channels, kernel_size = (1, 3), padding = (0, 1), bias = False)
        self.bn_t_3 = nn.BatchNorm2d(out_channels, momentum = 0.01, eps = 0.001)
        
        self.m_5 = nn.Conv2d(in_channels, out_channels, kernel_size = (5, 1), padding = (2, 0), bias = False)
        self.bn_m_5 = nn.BatchNorm2d(out_channels, momentum = 0.01, eps = 0.001)
        self.t_5 = nn.Conv2d(out_channels, out_channels, kernel_size = (1, 5), padding = (0, 2), bias = False)
        self.bn_t_5 = nn.BatchNorm2d(out_channels, momentum = 0.01, eps = 0.001)
        
        self.last = nn.Conv2d(out_channels, out_channels, kernel_size = (1, 1), padding = (0, 0), bias = False)
        self.bn_last = nn.BatchNorm2d(out_channels, momentum = 0.01, eps = 0.001)


    # 정의한 레이어들을 사용해 입력을 출력으로 변환하는 과정을 정의한 함수
    def forward(self, x):
        
        # x_3은 3x1 컨볼루션을 거친 후 ReLU 활성화 함수와 배치 정규화를 적용한 결과
        x_3 = self.relu(self.bn_m_3(self.m_3(x)))
        x_3 = self.relu(self.bn_t_3(self.t_3(x_3)))

        # x_5은 5x1 컨볼루션을 거친 후 ReLU 활성화 함수와 배치 정규화를 적용한 결과
        x_5 = self.relu(self.bn_m_5(self.m_5(x)))
        x_5 = self.relu(self.bn_t_5(self.t_5(x_5)))

        # x_3와 x_5의 결과 더하기
        x = x_3 + x_5

        # 1x1 컨볼루션, 배치 정규화, ReLU 적용
        x = self.relu(self.bn_last(self.last(x)))

        return x

# Visual_Block 정의
class Visual_Block(nn.Module):
    def __init__(self, in_channels, out_channels, is_down = False):
        super(Visual_Block, self).__init__()

        self.relu = nn.ReLU()

        # is_down 매개변수에 따라 다운샘플링을 실행할지를 결정
        if is_down:
            # 다운샘플링이 필요한 경우 stride를 2로 설정
            self.s_3 = nn.Conv3d(in_channels, out_channels, kernel_size = (1, 3, 3), stride = (1, 2, 2), padding = (0, 1, 1), bias = False)
            self.bn_s_3 = nn.BatchNorm3d(out_channels, momentum = 0.01, eps = 0.001)
            self.t_3 = nn.Conv3d(out_channels, out_channels, kernel_size = (3, 1, 1), padding = (1, 0, 0), bias = False)
            self.bn_t_3 = nn.BatchNorm3d(out_channels, momentum = 0.01, eps = 0.001)

            self.s_5 = nn.Conv3d(in_channels, out_channels, kernel_size = (1, 5, 5), stride = (1, 2, 2), padding = (0, 2, 2), bias = False)
            self.bn_s_5 = nn.BatchNorm3d(out_channels, momentum = 0.01, eps = 0.001)
            self.t_5 = nn.Conv3d(out_channels, out_channels, kernel_size = (5, 1, 1), padding = (2, 0, 0), bias = False)
            self.bn_t_5 = nn.BatchNorm3d(out_channels, momentum = 0.01, eps = 0.001)
        else:
            # 다운샘플링이 필요하지 않은 경우, stride는 기본값인 1로 설정
            self.s_3 = nn.Conv3d(in_channels, out_channels, kernel_size = (1, 3, 3), padding = (0, 1, 1), bias = False)
            self.bn_s_3 = nn.BatchNorm3d(out_channels, momentum = 0.01, eps = 0.001)
            self.t_3 = nn.Conv3d(out_channels, out_channels, kernel_size = (3, 1, 1), padding = (1, 0, 0), bias = False)
            self.bn_t_3 = nn.BatchNorm3d(out_channels, momentum = 0.01, eps = 0.001)

            self.s_5 = nn.Conv3d(in_channels, out_channels, kernel_size = (1, 5, 5), padding = (0, 2, 2), bias = False)
            self.bn_s_5 = nn.BatchNorm3d(out_channels, momentum = 0.01, eps = 0.001)
            self.t_5 = nn.Conv3d(out_channels, out_channels, kernel_size = (5, 1, 1), padding = (2, 0, 0), bias = False)
            self.bn_t_5 = nn.BatchNorm3d(out_channels, momentum = 0.01, eps = 0.001)

        # 마지막으로 1x1x1 컨볼루션을 적용하여 특성 맵의 차원을 조정하고, 배치 정규화를 실행한 후 ReLU 활성화 함수를 적용
        self.last = nn.Conv3d(out_channels, out_channels, kernel_size = (1, 1, 1), padding = (0, 0, 0), bias = False)
        self.bn_last = nn.BatchNorm3d(out_channels, momentum = 0.01, eps = 0.001)

    def forward(self, x):
        # 3x3x1 컨볼루션을 적용한 결과와 5x5x1 컨볼루션을 적용한 결과를 각각 계산하고, 이 두 결과를 합산
        x_3 = self.relu(self.bn_s_3(self.s_3(x)))
        x_3 = self.relu(self.bn_t_3(self.t_3(x_3)))

        x_5 = self.relu(self.bn_s_5(self.s_5(x)))
        x_5 = self.relu(self.bn_t_5(self.t_5(x_5)))

        x = x_3 + x_5

        # 최종적으로 1x1x1 컨볼루션을 적용하고, 배치 정규화를 실행한 후 ReLU 활성화 함수를 적용
        x = self.relu(self.bn_last(self.last(x)))

        return x

# Visual_encoder 정의
class visual_encoder(nn.Module):
    def __init__(self):
        super(visual_encoder, self).__init__()

        # 위에서 정의한 Visual_Block을 이용해 Convolution과 BatchNorm, 그리고 ReLU를 진행하는 블록을 생성

        # 첫번째 블록에서는 다운샘플링 진행
        self.block1 = Visual_Block(1, 32, is_down = True)
        self.pool1 = nn.MaxPool3d(kernel_size = (1, 3, 3), stride = (1, 2, 2), padding = (0, 1, 1))

        # 두번째 블록에서는 다운샘플링 진행 X
        self.block2 = Visual_Block(32, 64)
        self.block2 = Visual_Block(32, 64)
        self.pool2 = nn.MaxPool3d(kernel_size = (1, 3, 3), stride = (1, 2, 2), padding = (0, 1, 1))
        
        # 세번째 블록
        self.block3 = Visual_Block(64, 128)

        # 각 feature map에 대해 최댓값을 선택하여 고정된 크기의 출력을 생성
        self.maxpool = nn.AdaptiveMaxPool2d((1, 1))

        # 가중치 초기화 함수를 호출
        self.__init_weight()     

    def forward(self, x):

        # 입력 x에 대해 각 블록과 pooling layer를 차례로 통과
        x = self.block1(x)
        x = self.pool1(x)

        x = self.block2(x)
        x = self.pool2(x)

        x = self.block3(x)

        # tensor의 차원을 변환
        x = x.transpose(1,2)
        B, T, C, W, H = x.shape  
        x = x.reshape(B*T, C, W, H)

        # MaxPooling을 통해 각 time step에 대한 고정 길이의 벡터를 GET
        x = self.maxpool(x)

        # 마지막으로 tensor의 차원을 변환하여 최종 출력을 생성
        x = x.view(B, T, C)  
        
        return x

    def __init_weight(self):
        # 각 Layer의 가중치를 초기화
        for m in self.modules():
            if isinstance(m, nn.Conv3d):
                torch.nn.init.kaiming_normal_(m.weight)
            elif isinstance(m, nn.BatchNorm3d):
                m.weight.data.fill_(1)
                m.bias.data.zero_()


# Audio_encoder 정의
class audio_encoder(nn.Module):
    def __init__(self):
        super(audio_encoder, self).__init__()
        
        # 위에서 정의한 Audio_Block을 이용해 Convolution과 BatchNorm을 진행하는 블록을 생성\

        # 첫번째 블록
        self.block1 = Audio_Block(1, 32)
        self.pool1 = nn.MaxPool3d(kernel_size = (1, 1, 3), stride = (1, 1, 2), padding = (0, 0, 1))

        # 두번째 블록
        self.block2 = Audio_Block(32, 64)
        self.pool2 = nn.MaxPool3d(kernel_size = (1, 1, 3), stride = (1, 1, 2), padding = (0, 0, 1))
        
        # 세번째 블록
        self.block3 = Audio_Block(64, 128)

        # 가중치 초기화 함수를 호출
        self.__init_weight()
            
    def forward(self, x):
        # 입력 x에 대해 각 블록과 pooling layer를 차례로 통과
        x = self.block1(x)
        x = self.pool1(x)

        x = self.block2(x)
        x = self.pool2(x)

        x = self.block3(x)

        # tensor에서 시간에 따라 mean을 계산하고, 차원을 재조정
        x = torch.mean(x, dim = 2, keepdim = True)
        x = x.squeeze(2).transpose(1, 2)
        
        return x

    def __init_weight(self):
        # 각 Layer의 가중치를 초기화
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                torch.nn.init.kaiming_normal_(m.weight)
            elif isinstance(m, nn.BatchNorm2d):
                m.weight.data.fill_(1)
                m.bias.data.zero_()