import numpy as np
from itertools import product as product
import torch
from torch.autograd import Function

# non-maximum suppression
def nms_(dets, thresh):
    x1 = dets[:, 0]
    y1 = dets[:, 1]
    x2 = dets[:, 2]
    y2 = dets[:, 3]
    scores = dets[:, 4]

    areas = (x2 - x1) * (y2 - y1)
    order = scores.argsort()[::-1]

    keep = []
    while order.size > 0:
        i = order[0]
        keep.append(int(i))
        xx1 = np.maximum(x1[i], x1[order[1:]])
        yy1 = np.maximum(y1[i], y1[order[1:]])
        xx2 = np.minimum(x2[i], x2[order[1:]])
        yy2 = np.minimum(y2[i], y2[order[1:]])

        w = np.maximum(0.0, xx2 - xx1)
        h = np.maximum(0.0, yy2 - yy1)
        inter = w * h
        ovr = inter / (areas[i] + areas[order[1:]] - inter)

        inds = np.where(ovr <= thresh)[0]
        order = order[inds + 1]

    return np.array(keep).astype(int)       # nms에 의해 유지할 바운딩 박스의 인덱스를 정수 배열로 반환


def decode(loc, priors, variances):
    """
    예측된 바운딩 박스 좌표를 디코딩

    인자:
        loc (torch.Tensor): 바운딩 박스 좌표에 대한 예측된 오프셋
        priors (torch.Tensor): 예측에 사용되는 사전 정의된 박스(앵커)
        variances (tuple): 좌표 디코딩에 사용되는 스케일링 요소

    반환값:
        torch.Tensor: 디코딩된 바운딩 박스 좌표

    """

    # 오프셋과 변동값을 적용하여 디코딩된 박스를 계산
    boxes = torch.cat((
        priors[:, :2] + loc[:, :2] * variances[0] * priors[:, 2:],
        priors[:, 2:] * torch.exp(loc[:, 2:] * variances[1])), 1)
    
    # 박스 좌표를 조정하여 좌상단과 우하단 좌표 얻기
    boxes[:, :2] -= boxes[:, 2:] / 2
    boxes[:, 2:] += boxes[:, :2]
    return boxes


def nms(boxes, scores, overlap=0.5, top_k=200):
    """
    비최대 억제(NMS)를 수행하여 겹치는 바운딩 박스를 제거

    인자:
        boxes (torch.Tensor): 바운딩 박스 좌표
        scores (torch.Tensor): 바운딩 박스에 대한 점수
        overlap (float): 겹치는 영역의 임계값. 기본값은 0.5
        top_k (int): 유지할 상위 K개의 바운딩 박스 개수. 기본값은 200

    반환값:
        torch.Tensor: 유지된 바운딩 박스의 인덱스
        int: 유지된 바운딩 박스의 개수

    """

    keep = scores.new(scores.size(0)).zero_().long()

    # 바운딩 박스가 없는 경우 빈 결과를 반환
    if boxes.numel() == 0:
        return keep, 0
    
    # 바운딩 박스 좌표를 나타내는 변수들을 설정
    x1 = boxes[:, 0]
    y1 = boxes[:, 1]
    x2 = boxes[:, 2]
    y2 = boxes[:, 3]

    # 각 바운딩 박스의 영역(area)을 계산
    area = torch.mul(x2 - x1, y2 - y1)

    # 점수를 기준으로 내림차순으로 정렬한 후 상위 K개의 인덱스를 선택
    v, idx = scores.sort(0)  # 오름차순으로 정렬
    idx = idx[-top_k:]  # 가장 큰 값들의 인덱스 (상위 k개)
    xx1 = boxes.new()
    yy1 = boxes.new()
    xx2 = boxes.new()
    yy2 = boxes.new()
    w = boxes.new()
    h = boxes.new()

    count = 0
    while idx.numel() > 0:
        i = idx[-1]  # 현재 가장 큰 값의 인덱스
        # keep.append(i)
        keep[count] = i
        count += 1
        if idx.size(0) == 1:
            break
        idx = idx[:-1]  # 유지된 요소를 뷰에서 제거
        # 다음으로 높은 점수의 바운딩 박스 로드
        torch.index_select(x1, 0, idx, out=xx1)
        torch.index_select(y1, 0, idx, out=yy1)
        torch.index_select(x2, 0, idx, out=xx2)
        torch.index_select(y2, 0, idx, out=yy2)
        # 다음으로 높은 점수와 요소별 최대값 저장
        xx1 = torch.clamp(xx1, min=x1[i])
        yy1 = torch.clamp(yy1, min=y1[i])
        xx2 = torch.clamp(xx2, max=x2[i])
        yy2 = torch.clamp(yy2, max=y2[i])
        w.resize_as_(xx2)
        h.resize_as_(yy2)
        w = xx2 - xx1
        h = yy2 - yy1
        # 각 반복 후 xx1과 xx2의 크기 확인.. 
        w = torch.clamp(w, min=0.0)
        h = torch.clamp(h, min=0.0)
        inter = w * h
        # IoU = i / (area(a) + area(b) - i)
        rem_areas = torch.index_select(area, 0, idx)  # 남은 영역 로드
        union = (rem_areas - inter) + area[i]
        IoU = inter / union  # 결과를 iou에 저장
        # IoU <= overlap인 요소만 유지
        idx = idx[IoU.le(overlap)]
    return keep, count


class Detect(object):

    def __init__(self, num_classes=2,
                    top_k=750, nms_thresh=0.3, conf_thresh=0.05,
                    variance=[0.1, 0.2], nms_top_k=5000):
        
        """
        객체를 초기화합니다.

        인자:
            num_classes (int): 클래스의 개수. 기본값은 2.
            top_k (int): 최대로 유지할 상위 K개의 바운딩 박스 개수. 기본값은 750.
            nms_thresh (float): 비최대 억제(NMS)를 위한 겹치는 영역의 임계값. 기본값은 0.3.
            conf_thresh (float): 바운딩 박스의 신뢰도 임계값. 기본값은 0.05.
            variance (list): 좌표 디코딩에 사용되는 스케일링 요소. 기본값은 [0.1, 0.2].
            nms_top_k (int): 비최대 억제(NMS) 이후에 유지할 상위 K개의 바운딩 박스 개수. 기본값은 5000.
        """
        
        self.num_classes = num_classes
        self.top_k = top_k
        self.nms_thresh = nms_thresh
        self.conf_thresh = conf_thresh
        self.variance = variance
        self.nms_top_k = nms_top_k

    def forward(self, loc_data, conf_data, prior_data):
        """
        순전파(forward) 함수

        인자:
            loc_data (Tensor): 위치 정보 데이터
            conf_data (Tensor): 신뢰도 데이터
            prior_data (Tensor): 사전 데이터

        반환값:
            output (Tensor): 출력 데이터
        """

        num = loc_data.size(0)
        num_priors = prior_data.size(0)

        # 신뢰도 데이터를 클래스별로 재구성하여 전치
        conf_preds = conf_data.view(num, num_priors, self.num_classes).transpose(2, 1)

        # 사전 데이터를 배치 차원으로 확장하고 형태를 변경
        batch_priors = prior_data.view(-1, num_priors, 4).expand(num, num_priors, 4)
        batch_priors = batch_priors.contiguous().view(-1, 4)

        # 위치 정보 데이터를 디코딩하여 바운딩 박스를 생성
        decoded_boxes = decode(loc_data.view(-1, 4), batch_priors, self.variance)
        decoded_boxes = decoded_boxes.view(num, num_priors, 4)

        # 출력 텐서를 초기화
        output = torch.zeros(num, self.num_classes, self.top_k, 5)

        for i in range(num):
            # 현재 배치의 디코딩된 박스와 신뢰도를 복사
            boxes = decoded_boxes[i].clone()
            conf_scores = conf_preds[i].clone()

            for cl in range(1, self.num_classes):
                # 신뢰도 임계값을 초과하는 클래스 마스크를 생성
                c_mask = conf_scores[cl].gt(self.conf_thresh)
                scores = conf_scores[cl][c_mask]
                
                # 만약 점수의 차원이 0인 경우, 다음 클래스로 넘어감
                if scores.dim() == 0:
                    continue

                # 클래스 마스크를 박스에 대해 확장하여 형태를 맞춤
                l_mask = c_mask.unsqueeze(1).expand_as(boxes)
                boxes_ = boxes[l_mask].view(-1, 4)

                # 비최대 억제(NMS)를 수행하여 유지할 박스의 인덱스와 개수를 확인
                ids, count = nms(boxes_, scores, self.nms_thresh, self.nms_top_k)
                count = count if count < self.top_k else self.top_k

                # 출력 텐서에 점수와 박스를 결합하여 저장
                output[i, cl, :count] = torch.cat((scores[ids[:count]].unsqueeze(1), boxes_[ids[:count]]), 1)

        return output


class PriorBox(object):

    def __init__(self, input_size, feature_maps,
                    variance=[0.1, 0.2],
                    min_sizes=[16, 32, 64, 128, 256, 512],
                    steps=[4, 8, 16, 32, 64, 128],
                    clip=False):
        """
        초기화 함수

        인자:
            input_size (list): 입력 이미지 크기를 나타내는 리스트 [높이, 너비]
            feature_maps (list): 특성 맵 크기를 나타내는 리스트
            variance (list): 변동성을 나타내는 리스트
            min_sizes (list): 최소 크기를 나타내는 리스트
            steps (list): 각 특성 맵의 스텝 크기를 나타내는 리스트
            clip (bool): 바운딩 박스를 이미지 경계로 클리핑할지 여부를 나타내는 플래그
        """

        super(PriorBox, self).__init__()

        self.imh = input_size[0]
        self.imw = input_size[1]
        self.feature_maps = feature_maps

        self.variance = variance
        self.min_sizes = min_sizes
        self.steps = steps
        self.clip = clip

    def forward(self):
        """
        순전파 함수

        반환값:
            output (torch.Tensor): 생성된 사전 박스들을 나타내는 텐서
        """
        mean = []
        for k, fmap in enumerate(self.feature_maps):
            feath = fmap[0] # 특성 맵의 높이
            featw = fmap[1] # 특성 맵의 너비
            for i, j in product(range(feath), range(featw)):
                f_kw = self.imw / self.steps[k]
                f_kh = self.imh / self.steps[k]

                cx = (j + 0.5) / f_kw
                cy = (i + 0.5) / f_kh

                s_kw = self.min_sizes[k] / self.imw
                s_kh = self.min_sizes[k] / self.imh

                mean += [cx, cy, s_kw, s_kh]

        output = torch.FloatTensor(mean).view(-1, 4)
        
        if self.clip:
            output.clamp_(max=1, min=0) # 바운딩 박스를 이미지 경계로 클리핑
        
        return output   # 생성된 사전 박스들을 나타내는 텐서 반환
