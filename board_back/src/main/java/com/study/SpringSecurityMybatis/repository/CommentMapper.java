package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.entity.Comment;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommentMapper {
    int save(Comment comment);
    List<Comment> findAllByBoardId(Long boardId); // 순서 중요하기 때문에 List로 들고와야함
    int getCommentCountByBoardId(Long boardId);
    int deleteById(Long id);
    int modifyById(Comment comment); // 업데이트할때 뭘 업데이트 할건지 변수명에 적어줌


    Comment findById(Long id);
    Comment findByParentId(Long parentId); // 자식 요소 찾기

}
