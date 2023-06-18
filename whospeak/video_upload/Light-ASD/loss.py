import torch  
import torch.nn as nn  
import torch.nn.functional as F  

class lossAV(nn.Module):  
	def __init__(self):
		super(lossAV, self).__init__()  
		self.criterion = nn.BCELoss()  		# 이진 크로스 엔트로피 손실 설정
		self.FC        = nn.Linear(128, 2)  # 선형 계층 설정(128개의 입력 노드, 2개의 출력 노드)
		
	# 순전파 메서드
	def forward(self, x, labels = None, r = 1):	 
		x = x.squeeze(1)  	# 입력 텐서 차원 조절
		x = self.FC(x)  	# 선형 계층 통과
		
		# 레이블이 없는 경우
		if labels == None:  
			predScore = x[:,1]  									# 예측 점수 추출
			predScore = predScore.t()  								# 예측 점수 전치
			predScore = predScore.view(-1).detach().cpu().numpy()  	# 예측 점수 reshape하고 numpy 배열로 변환
			return predScore  # 예측 점수 반환
		
		# 레이블이 있는 경우
		else:  				
			x1 = x / r  											# 입력에 정규화 상수 r 적용
			x1 = F.softmax(x1, dim = -1)[:,1] 						# 소프트맥스 함수 적용
			nloss = self.criterion(x1, labels.float())  			# 이진 크로스 엔트로피 손실 계산
			predScore = F.softmax(x, dim = -1)  					# 소프트맥스 함수를 이용한 예측 점수 계산
			predLabel = torch.round(F.softmax(x, dim = -1))[:,1]  	# 반올림하여 최종 예측 레이블 생성
			correctNum = (predLabel == labels).sum().float()  		# 예측이 정확한 레이블의 수 계산
			return nloss, predScore, predLabel, correctNum  		# 손실, 예측 점수, 예측 레이블, 정확한 예측 수 반환


class lossV(nn.Module):  
	def __init__(self):
		super(lossV, self).__init__()  
		self.criterion = nn.BCELoss()  		# 이진 크로스 엔트로피 손실 설정
		self.FC        = nn.Linear(128, 2)  # 선형 계층 설정(128개의 입력 노드, 2개의 출력 노드)

	# 순전파 메서드
	def forward(self, x, labels, r = 1):	 
		x = x.squeeze(1)  					# 입력 텐서 차원 조절
		x = self.FC(x)  					# 선형 계층 통과
		
		x = x / r  							# 입력에 정규화 상수 r 적용
		x = F.softmax(x, dim = -1)  		# 소프트맥스 함수 적용

		nloss = self.criterion(x[:,1], labels.float())  # 이진 크로스 엔트로피 손실 계산
		return nloss  # 손실 반환
