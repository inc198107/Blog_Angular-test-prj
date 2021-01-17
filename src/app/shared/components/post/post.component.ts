import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../../interfaces';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: Post
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  toDetails():void{
    this.router.navigate(['/post', 12131])
  }

}
