import { AppDataSource } from '../datasource'

import User from './entities/User';
import Post from './entities/Post';
import Comment from './entities/Comment';

import { faker } from '@faker-js/faker';


function callFunction<R>(func:(args:any, previousReturn:R) => R, n:number, args?:any):R[] {
    var returnValues:R[] = [];

    for (let i = 1; i <= n; i++)
        returnValues.push(func(args, returnValues[-1]));

    return returnValues;
}

async function callPromiseFunction<R>(func:(args:any, previousReturn:R) => Promise<R>, n:number, args?:any):Promise<R[]> {
    var returnValues:R[] = [];

    for (let i = 1; i <= n; i++) {
        const ret = await func(args, returnValues[-1])
        returnValues.push(ret);
    }

    return returnValues;
}

function createUser():User {
    const gender = faker.person.sex();

    const firstName = faker.person.firstName(gender == "male" ? "male" : "female");
    const lastName = faker.person.lastName();
    const displayName = faker.internet.displayName({firstName, lastName});
    //const username = faker.internet.userName({ firstName: firstName, lastName: lastName });
    const password = faker.internet.password();

    const avatar = faker.image.avatar(/*gender == "male" ? "male" : "female"*/);

    const email = faker.internet.exampleEmail({ firstName, lastName, allowSpecialCharacters: true });

    const dob = faker.date.past({ years: 18, refDate: Date.now()});
    const signup = faker.date.between({ from: dob, to: Date.now()});
    const lastLogin = faker.date.between({ from: signup, to: Date.now()});

    const user:User = new User();

    Object.assign(user, {
        firstName,
        lastName,
        //username,
        displayName,
        dob,
        email: email,
        password,
        avatar,
        signup,
        lastLogin
    });

    return user;
}

async function generateUsers():Promise<void> {
    const users: User[] = <User[]> callFunction<User>(createUser, 100);

    await AppDataSource.createEntityManager().save<User>(users);
}

async function getNumberOfUsers():Promise<number> {
    return await AppDataSource.getRepository(User).createQueryBuilder("user").getCount();
}

async function selectUser(id:number):Promise<User | null> {
    return await User.findOne({ where: {id} });
}

async function selectUserAtRandom():Promise<User | null> {
    return selectUser(faker.number.int({ min: 1, max: await getNumberOfUsers() }));
}


function createComment(post:Post, previousComment:Comment):Comment {
    const comment:Comment = new Comment();

    const user = faker.datatype.boolean() ? faker.datatype.boolean() ? (previousComment?.user || post.user) : post.user : selectUserAtRandom();
    const text = faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 }));
    const date = faker.date.between({ from: post.date, to: Date.now() });

    Object.assign(comment, {
        user,
        text,
        date,
        post
    });

//    console.log("comment = ", comment);

    return comment;
}

async function createComments(post:Post):Promise<Comment[]> {
    const comments: Comment[] = <Comment[]> callFunction<Comment>(createComment, faker.datatype.boolean() ? faker.number.int({ min: 0, max: 25 }) : 0, post);

//    console.log("comments = ", comments);
//    console.log("test");
    console.log("createComments():comments.length = ", comments.length);

//    await AppDataSource.createEntityManager().save<Comment>(comments);

    return comments;
}

async function createPost():Promise<Post> {
    console.log("createPost()");

    const feed = 1;
    const text = faker.lorem.paragraphs(faker.number.int({ min: 0, max: 5 }));
    const user = <User> await selectUserAtRandom();
    const date = faker.date.between({ from: user.signup, to: Date.now()});

    const post:Post = new Post();

    Object.assign(post, {
        feed,
        text,
        user,
        date
    });

    const comments = await createComments(post);

    console.log("comments.length = ", comments.length);

    post.comments = comments;

    console.log("createPost():end");
    return post;
}

async function generatePosts():Promise<void> {
    console.log("generatePosts()");
    const posts: Post[] = await callPromiseFunction<Post>(createPost, 100);

    console.log("generatePosts():save posts");
    await AppDataSource.createEntityManager().save<Post>(posts);
    console.log("generatePosts():end");
}

async function Seed() {
    await AppDataSource.initialize();

    await generateUsers();
    await generatePosts();

    console.log("users = ", await AppDataSource.getRepository(User).createQueryBuilder("user").getCount());
    console.log("posts = ", await AppDataSource.getRepository(Post).createQueryBuilder("post").getCount());
    console.log("comments = ", await AppDataSource.getRepository(Comment).createQueryBuilder("comment").getCount());
}

Seed();
