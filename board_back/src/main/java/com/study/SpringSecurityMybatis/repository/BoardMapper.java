package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.entity.Board;
import com.study.SpringSecurityMybatis.entity.BoardList;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BoardMapper {
    int save(Board board);
    Board findById(Long id);
    int modifyViewCountById(Long id); // Long, long은 null을 대입을 할 수 있고 없고 차이

    List<BoardList> findAllByStartIndexAndLimit(
            @Param("startIndex") Long startIndex,
            @Param("limit") Long limit);

    int getCountAll();
}
