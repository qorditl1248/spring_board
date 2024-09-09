package com.study.SpringSecurityMybatis.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class RespBoardDetailDto {
    private Long boardId;
    private String title;
    private String content;
    private Long writerId;
    private String writerUsername; // id에 해당하는 username 가지고 와야함 (즉, 조인해서 들고와야함)
    private int viewCount;


}
