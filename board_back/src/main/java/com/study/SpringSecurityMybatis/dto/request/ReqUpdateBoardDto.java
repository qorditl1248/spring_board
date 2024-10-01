package com.study.SpringSecurityMybatis.dto.request;

import com.study.SpringSecurityMybatis.entity.Board;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReqUpdateBoardDto {
    private Long id;
    private String title;
    private String content;

    public Board toEntity() {
        return Board.builder()
                .id(id)
                .title(title)
                .content(content)
                .build();
    }
}
