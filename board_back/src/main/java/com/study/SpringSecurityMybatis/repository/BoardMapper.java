package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.entity.Board;
import com.study.SpringSecurityMybatis.entity.BoardList;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface BoardMapper {
    int save(Board board);
    Board findById(Long id);
    int modifyViewCountById(Long id); // Long, long은 null을 대입을 할 수 있고 없고 차이

    List<BoardList> findAllByStartIndexAndLimit(
            @Param("startIndex") Long startIndex,
            @Param("limit") Long limit);

    int getCountAll();

    int getCountAllBySearch(Map<String, Object> params);

    // 게시물 검색 기능
    List<BoardList> findAllBySearch(Map<String, Object> params);

    int deleteById(Long id);

    int updateText(Board board);
}
