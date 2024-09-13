package com.study.SpringSecurityMybatis.service;

import com.study.SpringSecurityMybatis.dto.request.ReqBoardListDto;
import com.study.SpringSecurityMybatis.dto.request.ReqWriteBoardDto;
import com.study.SpringSecurityMybatis.dto.response.RespBoardDetailDto;
import com.study.SpringSecurityMybatis.dto.response.RespBoardLikeInfoDto;
import com.study.SpringSecurityMybatis.dto.response.RespBoardListDto;
import com.study.SpringSecurityMybatis.entity.Board;
import com.study.SpringSecurityMybatis.entity.BoardLike;
import com.study.SpringSecurityMybatis.entity.BoardList;
import com.study.SpringSecurityMybatis.exception.NotFoundBoardException;
import com.study.SpringSecurityMybatis.repository.BoardLikeMapper;
import com.study.SpringSecurityMybatis.repository.BoardMapper;
import com.study.SpringSecurityMybatis.security.principal.PrincipalUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoardService {

    @Autowired
    private BoardMapper boardMapper;

    @Autowired
    private BoardLikeMapper boardLikeMapper;

    public Long writeBoard(ReqWriteBoardDto dto) {

        PrincipalUser principalUser = (PrincipalUser) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        Board board = dto.toEntity(principalUser.getId());

        boardMapper.save(board);

        return board.getId();
    }


    // 게시글 들고오기
    public RespBoardDetailDto getBoardDetail(Long boardId) {

        Board board = boardMapper.findById(boardId);

        if(board == null) {
            throw new NotFoundBoardException("해당 게시글을 찾을 수 없습니다.");
        }

        boardMapper.modifyViewCountById(boardId);


        return RespBoardDetailDto.builder()
                .boardId(board.getId())
                .title(board.getTitle())
                .content(board.getContent())
                .writerId(board.getUserId())
                .writerUsername(board.getUser().getUsername())
                .viewCount(board.getViewCount() + 1)
                .build();
    }

    public RespBoardLikeInfoDto getBoardLike(Long boardId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = null;

        if(!authentication.getName().equals("anonymousUser")) {
            PrincipalUser principalUser = (PrincipalUser) authentication.getPrincipal();
            userId = principalUser.getId();
        }

        BoardLike boardLike = boardLikeMapper.findByBoardIdAndUserId(boardId, userId);

        int likeCount = boardLikeMapper.getLikeCountByBoardId(boardId);

        return RespBoardLikeInfoDto
                .builder()
                .boardLikeId(boardLike == null ? 0 : boardLike.getId())
                .likeCount(likeCount)
                .build();
    }

    // 좋아요 누름
    public void like(Long boardId) {

        PrincipalUser principalUser = (PrincipalUser) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        BoardLike boardLike = BoardLike.builder()
                .boardId(boardId)
                .userId(principalUser.getId())
                .build();

        boardLikeMapper.save(boardLike);
    }

    // 좋아요 삭제
    public void dislike(Long boardLikeId) {
        boardLikeMapper.deleteById(boardLikeId);
    }

    // board 리스트 뽑아오기
    public RespBoardListDto getBoardList(ReqBoardListDto dto) {
        Long startIndex = (dto.getPage() - 1) * dto.getLimit();  // (해당 페이지번호 - 1) * (limit 수 - 10으로 정해둠)
        List<BoardList> boardLists = boardMapper.findAllByStartIndexAndLimit(startIndex, dto.getLimit());
        Integer boardTotalCount = boardMapper.getCountAll();

        return RespBoardListDto.builder()
                .boards(boardLists)
                .totalCount(boardTotalCount)
                .build();
    }

}
