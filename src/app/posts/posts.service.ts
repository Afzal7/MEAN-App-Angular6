import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostsService {
	private posts: Post[] = [];
	private postsUpdated = new Subject<Post[]>();

	constructor(private http: HttpClient){
		 
	}

	getPosts() {
		// return [...this.posts];
		this.http.get<{message: string, posts: any}>('http://localhost:8000/api/posts')
			.pipe(map((postData) => {
				return postData.posts.map(post => {
					return {
						title: post.title,
						content: post.content,
						id: post._id
					}
				})
			}))
			.subscribe((posts) => {
				this.posts = posts;
				this.postsUpdated.next([...this.posts]);
			});
	}

	getPostUpdateListener() {
		return this.postsUpdated.asObservable();
	}

	addPost(title: string, content: string) {
		const post: Post = {id: null, title: title, content: content};
		this.http.post<{message: string, postId: string}>('http://localhost:8000/api/posts', post)
			.subscribe((postData) => {
				console.log(postData);

				post.id = postData.postId;
				this.posts.push(post);
				this.postsUpdated.next([...this.posts]);
			});
	}

	deletePost(postId: String){
		this.http.delete('http://localhost:8000/api/posts/'+postId)
			.subscribe((response) => {
				console.log(response);
				const updatedPosts = this.posts.filter(post => post.id !== postId);
				this.posts = updatedPosts;
				this.postsUpdated.next([...this.posts]);
			});
	}
}
