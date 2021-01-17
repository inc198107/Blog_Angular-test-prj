import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/shared/interfaces';
import { PostService } from 'src/app/shared/post.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  postsArr: Post[]
  pSub: Subscription
  dSub:Subscription
  searchStr: string = ''

  constructor(
    private postsService: PostService,
    private alert: AlertService
    ) { }

  ngOnInit(): void {
   this.pSub =  this.postsService.getAll().subscribe(posts => {
      this.postsArr = posts
    })
  }

  remove(id: string) {
   this.dSub =  this.postsService.remove(id).subscribe(() =>{
      this.postsArr = this.postsArr.filter(post => post.id !== id)
      this.alert.danger('post was deleted')
    })
  }

  ngOnDestroy(): void{
    if(this.pSub){
      this.pSub.unsubscribe();
    }
    if(this.dSub){
      this.dSub.unsubscribe();
    }
  }

}
