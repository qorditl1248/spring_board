package com.study.SpringSecurityMybatis.controller;

import com.study.SpringSecurityMybatis.aspect.annotation.ValidAop;
import com.study.SpringSecurityMybatis.dto.request.ReqBoardListDto;
import com.study.SpringSecurityMybatis.dto.request.ReqSearchDto;
import com.study.SpringSecurityMybatis.dto.request.ReqUpdateBoardDto;
import com.study.SpringSecurityMybatis.dto.request.ReqWriteBoardDto;
import com.study.SpringSecurityMybatis.service.BoardService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@Slf4j
@RestController
public class BoardController {

    @Autowired private BoardService boardService;

    // 게시판 글 등록
    @ValidAop
    @PostMapping("/board")
    public ResponseEntity<?> write(@Valid @RequestBody ReqWriteBoardDto dto, BindingResult bindingResult) {
        System.out.println(boardService.writeBoard(dto));
//        return ResponseEntity.ok().body(boardService.writeBoard(dto));
        return ResponseEntity.ok().body(Map.of("boardId", boardService.writeBoard(dto)));
    }

    // 해당 아이디의 맞는 게시판 글 불러오기
    @GetMapping("/board/{boardId}")
    public ResponseEntity<?> getDetail(@PathVariable Long boardId) {
        return ResponseEntity.ok().body(boardService.getBoardDetail(boardId));
    }

    // 게시판 리스트 불러오기
    @GetMapping("/board/list")
    public ResponseEntity<?> getBoards(ReqBoardListDto dto) {
        return ResponseEntity.ok().body(boardService.getBoardList(dto));
    }

    @GetMapping("/board/{boardId}/like")
    public ResponseEntity<?> getLikeInfo(@PathVariable Long boardId) {
        return ResponseEntity.ok().body(boardService.getBoardLike(boardId));
    }

    // 게시글 검색
    @GetMapping("/board/search")
    public ResponseEntity<?> getSearchBoards(ReqSearchDto dto) {
        return ResponseEntity.ok().body(boardService.getSearchBoard(dto));
    }

    @PostMapping("/board/{boardId}/like")
    public ResponseEntity<?> like(@PathVariable Long boardId) {
        boardService.like(boardId);
        return ResponseEntity.ok().body(true);
    }

    @DeleteMapping("/board/like/{boardLikeId}")
    public ResponseEntity<?> dislike(@PathVariable Long boardLikeId) {
        boardService.dislike(boardLikeId);
        return ResponseEntity.ok().body(true);
    }

    @DeleteMapping("/board/text/{boardId}")
    public ResponseEntity<?> deleteText(@PathVariable Long boardId) {
        boardService.deleteText(boardId);
        return ResponseEntity.ok().body(true);
    }

    @PutMapping("/board/text/{boardId}")
    public ResponseEntity<?> updateText(@PathVariable Long boardId, @RequestBody ReqUpdateBoardDto dto) {
//        System.out.println(dto);
//        dto.setId(boardId);
//        System.out.println(boardId);
        boardService.updateText(dto, boardId);
        return ResponseEntity.ok().body(true);
    }


//    @ValidAop
//    @PostMapping("/test")
//    public ResponseEntity<?> test(@Valid @RequestBody ReqTestDto dto, BindingResult bindingResult) {
//        System.out.println(dto);
//        return ResponseEntity.ok().body(null);
//    }


}
