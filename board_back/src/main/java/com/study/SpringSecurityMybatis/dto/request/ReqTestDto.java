package com.study.SpringSecurityMybatis.dto.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ReqTestDto {

    @NotBlank(message = "내용은 빈값일 수 없습니다.")
    private String content;
}
