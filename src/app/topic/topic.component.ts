import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { DataCollectionService } from '../data-collection.service';
import { Post } from "./posts.model";
import { CookieService } from "ngx-cookie-service";
import { Follow } from "./follow.model";
import { user } from "./user.model";
import * as jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})
export class TopicComponent implements OnInit {

  topics: any;
  posts: any;
  name: any;
  id: any;
  topicposts: any;
  post: string = ""
  userId: any;
  userName: any;
  follow: any
  profileName: any
  user: user;

  constructor(
    private topicsService: DataCollectionService,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService) { }

  ngOnInit() {
    console.log("Init in topic");
    this.route.paramMap.subscribe(params => { this.name = params.get("id") })
    console.log("---topic_details--" + this.name);

    this.route.queryParams.subscribe(params => { this.id = +params["topicData"] })
    console.log("---topic_details--" + this.id);

    this.topicsService.getPosts(this.name).subscribe(
      (data) => {
        this.posts = data;
        console.log("Posts", this.posts);
      });


    let token = this.cookieService.get("UserLoginAPItoken");

    let decodedJwtData = jwtDecode(token);
    let userId = decodedJwtData.UserID;
    let userName = decodedJwtData.Name;

    this.user = { userId, userName, };

    console.log(this.user.userId);

    var check = new Follow()
    check.TopicId = this.id
    //changed this.user.userId to userId
    check.UserId = this.user.userId


  }

  toggle() {
    var followingTopics = new Follow()
    followingTopics.TopicId = this.id
    followingTopics.UserId = this.user.userId
    followingTopics.user = this.user;
    followingTopics.follow = this.follow;
    this.topicsService.postFollowingTopics(followingTopics).subscribe((data) => console.log(data));
    this.follow = !this.follow;
  }

  gotoGameplay() {
    window.location.href = "http://172.23.238.164:7000/gameplay/play/" + this.name + "/two-players";
  }

  gotoProfile() {
    for (let post of this.posts) {
      var name = new Post()
      name.userName = post.userName
      name.userId = post.userId
    }
    this.router.navigate(['/profile/' + name.userName], { queryParams: { UserData: name.userId } })
  }

  createPosts() {
    console.log("--post--", this.post)
    var feed = new Post()
    feed.post = this.post
    feed.topicId = this.id
    feed.userId = this.user.userId
    feed.userName = this.user.userName
    this.topicsService.postFeed(feed).subscribe((data) => console.log(data));
    console.log("--post--", feed)
  }
}
