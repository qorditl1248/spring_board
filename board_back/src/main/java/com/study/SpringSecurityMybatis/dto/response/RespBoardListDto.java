package com.study.SpringSecurityMybatis.dto.response;

import com.study.SpringSecurityMybatis.entity.BoardList;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RespBoardListDto {
    private List<BoardList> boards;
    private Integer totalCount;
}
