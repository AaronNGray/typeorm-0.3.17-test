import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import User from "./User";
import Post from "./Post";

@Entity("Comment")
export default class Comment extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => User, (user) => user.comments)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    text: string;

    @Column()
    date: Date;

    @ManyToOne((type) => Post, (post) => post.comments)
    @JoinColumn({ name: 'post_id' })
    post: Post;
}
