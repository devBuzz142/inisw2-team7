import torch
from torch import nn


class BGRU(nn.Module):
    def __init__(self, channel):
        super(BGRU, self).__init__()

        # GRU 셀 정의 
        # 입력과 hidden 상태의 크기는 channel로 동일하게 설정 
        # num_layers = 1 : GRU 층 = 한 층
        # bidirectional = False : 양방향 GRU X
        self.gru_forward = nn.GRU(input_size = channel, hidden_size = channel, num_layers = 1, bidirectional = False, bias = True, batch_first = True)
        self.gru_backward = nn.GRU(input_size = channel, hidden_size = channel, num_layers = 1, bidirectional = False, bias = True, batch_first = True)
        
        # GELU 활성화 함수.
        self.gelu = nn.GELU()
        self.gelu = nn.GELU()

        # 가중치 초기화 함수 호출
        self.__init_weight()

    def forward(self, x):
        x, _ = self.gru_forward(x)  # forward 방향의 GRU에 입력을 통과
        x = self.gelu(x)            # GRU의 출력에 GELU 활성화 함수를 적용
        x = torch.flip(x, dims=[1]) # 텐서를 뒤집어 backward 방향을 만드는데 사용
        x, _ = self.gru_backward(x) # 뒤집힌 텐서를 backward 방향의 GRU에 통과
        x = torch.flip(x, dims=[1]) # 텐서를 다시 뒤집어 원래의 순서로 돌리기
        x = self.gelu(x)            # GRU의 출력에 GELU 활성화 함수를 적용

        return x                    # 마지막으로 변환된 텐서를 반환

    # 가중치 초기화 함수를 정의
    def __init_weight(self):
        for m in self.modules():            
            if isinstance(m, nn.GRU):
                torch.nn.init.kaiming_normal_(m.weight_ih_l0)   # input-hidden 가중치를 초기화  
                torch.nn.init.kaiming_normal_(m.weight_hh_l0)   # hidden-hidden 가중치를 초기화합니다.
                m.bias_ih_l0.data.zero_()   # input-hidden 편향을 0으로 초기화
                m.bias_hh_l0.data.zero_()   # hidden-hidden 편향을 0으로 초기화