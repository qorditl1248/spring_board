package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.entity.Board;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BoardMapper {
    int save(Board board);
    Board findById(Long id);
    int modifyViewCountById(Long id); // Long, long은 null을 대입을 할 수 있고 없고 차이
}
