import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { AuthService } from "../../auth/auth.service";

@Component({
	selector: "app-post-list",
	templateUrl: "./post-list.component.html",
	styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
	// posts = [
	//   { title: "First Post", content: "This is the first post's content" },
	//   { title: "Second Post", content: "This is the second post's content" },
	//   { title: "Third Post", content: "This is the third post's content" }
	// ];
	posts: Post[] = [];
	userIsAuthenticated = false;
	private postsSub: Subscription;
	private authServiceSubs: Subscription;

	constructor(public postsService: PostsService, private authService: AuthService) {}

	ngOnInit() {
		this.postsService.getPosts();
		this.postsSub = this.postsService.getPostUpdateListener()
			.subscribe((posts: Post[]) => {
				this.posts = posts;
			});

		this.subscribeUserAuth();
	}

	onDelete(postId: string){
		this.postsService.deletePost(postId);
	}

	ngOnDestroy() {
		this.postsSub.unsubscribe();
		this.authServiceSubs.unsubscribe();
	}

	subscribeUserAuth(){
		this.userIsAuthenticated = this.authService.getIsAuth();
		console.log(this.userIsAuthenticated);
		this.authServiceSubs = this.authService.getAuthStatusListner()
			.subscribe(isAuthenticated => {
				console.log(isAuthenticated);
				this.userIsAuthenticated = isAuthenticated;
			});
	}
}
