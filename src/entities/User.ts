import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm";

import Post from "./Post";
import Comment from "./Comment";

@Entity()
export default class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: false })
    displayName: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ nullable: true })
    dob: Date;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
    signup: Date;

    @Column({ nullable: true })
    lastLogin: Date;

    @OneToMany((type) => Post, (post) => post.user)
    posts: Post[];

    @OneToMany((type) => Comment, (comment) => comment.user)
    comments: Comment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
