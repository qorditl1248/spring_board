package com.study.SpringSecurityMybatis.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RespSigninDto { // 정해진건 없음, 프론트쪽에서 필요한 데이터들 넘겨주는거
    private String message;
    private String expireDate;
    private String accessToken;
}
