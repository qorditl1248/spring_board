package com.study.SpringSecurityMybatis.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class UserRoles {
    private Long id;
    private Long userId;
    private Long roleId; // roleId와 role에 들어있는 id는 1:1
    private Role role;
}
