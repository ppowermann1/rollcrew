package com.rollcrew.rollcrew.domain.job.entity;


import com.rollcrew.rollcrew.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class JobPost {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PostStatus status = PostStatus.OPEN;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String shootingDates;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;


}
