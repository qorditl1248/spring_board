package com.study.SpringSecurityMybatis.service;

import com.study.SpringSecurityMybatis.dto.request.ReqModifyCommentDto;
import com.study.SpringSecurityMybatis.dto.request.ReqWriteCommentDto;
import com.study.SpringSecurityMybatis.dto.response.RespCommentDto;
import com.study.SpringSecurityMybatis.entity.Comment;
import com.study.SpringSecurityMybatis.exception.AccessDeniedException;
import com.study.SpringSecurityMybatis.repository.CommentMapper;
import com.study.SpringSecurityMybatis.security.principal.PrincipalUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


@Service
public class CommentService {

    @Autowired
    private CommentMapper commentMapper;

    // save
    public void write(ReqWriteCommentDto dto) {
        PrincipalUser principalUser = (PrincipalUser) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        commentMapper.save(dto.toEntity(principalUser.getId()));
    }

    // 해당 id 게시물의 댓글 리스트
    // 해당 id 게시물에 몇개의 댓글이 있는지
    public RespCommentDto getComments(Long boardId) {
        return RespCommentDto.builder()
                .comments(commentMapper.findAllByBoardId(boardId)) // list가 통으로 들어옴
                .commentCount(commentMapper.getCommentCountByBoardId(boardId))
                .build();
    }

    public void deleteComment(Long commentId) {
        accessCheck(commentId);
        commentMapper.deleteById(commentId);
    }

    public void modifyComment(ReqModifyCommentDto dto) {
        accessCheck(dto.getCommentId());
        commentMapper.modifyById(dto.toEntity());
    }


    private void accessCheck(Long commentId) {
        PrincipalUser principalUser = (PrincipalUser) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        Comment comment = commentMapper.findById(commentId);

        if(principalUser.getId() != comment.getWriterId()) {
            throw new AccessDeniedException();
        }
    }


}
