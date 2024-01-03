import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import User from "./User";
import Comment from "./Comment";

@Entity()
export default class Post extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: 0})
    feed: number;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    text: string;

    @Column()
    date: Date;

    @OneToMany((type) => Comment, comment => comment.post, { cascade: true })
    comments: Comment[];
}
