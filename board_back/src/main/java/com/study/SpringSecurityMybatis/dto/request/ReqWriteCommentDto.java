package com.study.SpringSecurityMybatis.dto.request;

import com.study.SpringSecurityMybatis.entity.Comment;
import lombok.Data;

@Data
public class ReqWriteCommentDto {
    private Long boardId;   // 작성한 곳의 id
    private Long parentId;  // 대댓글인지 확인
    private String content; // 내용

    public Comment toEntity(Long writeId) {
        return Comment.builder()
                .boardId(boardId)
                .parentId(parentId)
                .content(content)
                .writerId(writeId)
                .build();
    }
}
