"use strict";(self.webpackChunkgrade_scope_istic=self.webpackChunkgrade_scope_istic||[]).push([[505],{60505:(ae,v,a)=>{a.r(v),a.d(v,{CourseModule:()=>re});var I=a(94272),c=a(26696),_=a(58059),j=a(39841),d=a(74218),e=a(5e3),g=a(73420),Z=a(73357),l=a(69808),u=a(93075),m=a(41995),U=a(486),f=a(49444);const F=function(n){return{id:n}};function J(n,r){if(1&n){const t=e.EpF();e.TgZ(0,"form",1),e.NdJ("ngSubmit",function(){e.CHM(t);const i=e.oxw();return i.confirmDelete(i.course.id)}),e._uU(1,"\n  "),e.TgZ(2,"div",2),e._uU(3,"\n    "),e.TgZ(4,"h4",3),e._uU(5,"Confirm delete operation"),e.qZA(),e._uU(6,"\n\n    "),e.TgZ(7,"button",4),e.NdJ("click",function(){return e.CHM(t),e.oxw().cancel()}),e._uU(8,"\xd7"),e.qZA(),e._uU(9,"\n  "),e.qZA(),e._uU(10,"\n\n  "),e.TgZ(11,"div",5),e._uU(12,"\n    "),e._UZ(13,"jhi-alert-error"),e._uU(14,"\n\n    "),e.TgZ(15,"p",6),e._uU(16,"\n      Are you sure you want to delete this Course?\n    "),e.qZA(),e._uU(17,"\n  "),e.qZA(),e._uU(18,"\n\n  "),e.TgZ(19,"div",7),e._uU(20,"\n    "),e.TgZ(21,"button",8),e.NdJ("click",function(){return e.CHM(t),e.oxw().cancel()}),e._uU(22,"\n      "),e._UZ(23,"fa-icon",9),e._uU(24,"\xa0"),e.TgZ(25,"span",10),e._uU(26,"Cancel"),e.qZA(),e._uU(27,"\n    "),e.qZA(),e._uU(28,"\n\n    "),e.TgZ(29,"button",11),e._uU(30,"\n      "),e._UZ(31,"fa-icon",12),e._uU(32,"\xa0"),e.TgZ(33,"span",13),e._uU(34,"Delete"),e.qZA(),e._uU(35,"\n    "),e.qZA(),e._uU(36,"\n  "),e.qZA(),e._uU(37,"\n"),e.qZA()}if(2&n){const t=e.oxw();e.xp6(15),e.Q6J("translateValues",e.VKq(1,F,t.course.id))}}let N=(()=>{class n{constructor(t,o){this.courseService=t,this.activeModal=o}cancel(){this.activeModal.dismiss()}confirmDelete(t){this.courseService.delete(t).subscribe(()=>{this.activeModal.close("deleted")})}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(g.N),e.Y36(Z.Kz))},n.\u0275cmp=e.Xpm({type:n,selectors:[["ng-component"]],decls:2,vars:1,consts:[["name","deleteForm",3,"ngSubmit",4,"ngIf"],["name","deleteForm",3,"ngSubmit"],[1,"modal-header"],["data-cy","courseDeleteDialogHeading","jhiTranslate","entity.delete.title",1,"modal-title"],["type","button","data-dismiss","modal","aria-hidden","true",1,"btn-close",3,"click"],[1,"modal-body"],["id","jhi-delete-course-heading","jhiTranslate","gradeScopeIsticApp.course.delete.question",3,"translateValues"],[1,"modal-footer"],["type","button","data-dismiss","modal",1,"btn","btn-secondary",3,"click"],["icon","ban"],["jhiTranslate","entity.action.cancel"],["id","jhi-confirm-delete-course","data-cy","entityConfirmDeleteButton","type","submit",1,"btn","btn-danger"],["icon","times"],["jhiTranslate","entity.action.delete"]],template:function(t,o){1&t&&(e.YNc(0,J,38,3,"form",0),e._uU(1,"\n")),2&t&&e.Q6J("ngIf",o.course)},directives:[l.O5,u._Y,u.JL,u.F,m.P,U.A,f.BN],encapsulation:2}),n})();var T=a(39003),D=a(31427),P=a(1408),L=a(18133);function k(n,r){1&n&&(e.TgZ(0,"div",12),e._uU(1,"\n    "),e.TgZ(2,"span",13),e._uU(3,"No courses found"),e.qZA(),e._uU(4,"\n  "),e.qZA())}const C=function(n){return["/course",n,"view"]},Q=function(n){return["/course",n,"edit"]};function B(n,r){if(1&n){const t=e.EpF();e.TgZ(0,"tr",26),e._uU(1,"\n          "),e.TgZ(2,"td"),e._uU(3,"\n            "),e.TgZ(4,"a",27),e._uU(5),e.qZA(),e._uU(6,"\n          "),e.qZA(),e._uU(7,"\n          "),e.TgZ(8,"td"),e._uU(9),e.qZA(),e._uU(10,"\n          "),e.TgZ(11,"td"),e._uU(12),e.qZA(),e._uU(13,"\n          "),e.TgZ(14,"td",28),e._uU(15,"\n            "),e.TgZ(16,"div",29),e._uU(17,"\n              "),e.TgZ(18,"button",30),e._uU(19,"\n                "),e._UZ(20,"fa-icon",31),e._uU(21,"\n                "),e.TgZ(22,"span",32),e._uU(23,"View"),e.qZA(),e._uU(24,"\n              "),e.qZA(),e._uU(25,"\n\n              "),e.TgZ(26,"button",33),e._uU(27,"\n                "),e._UZ(28,"fa-icon",34),e._uU(29,"\n                "),e.TgZ(30,"span",35),e._uU(31,"Edit"),e.qZA(),e._uU(32,"\n              "),e.qZA(),e._uU(33,"\n\n              "),e.TgZ(34,"button",36),e.NdJ("click",function(){const s=e.CHM(t).$implicit;return e.oxw(2).delete(s)}),e._uU(35,"\n                "),e._UZ(36,"fa-icon",37),e._uU(37,"\n                "),e.TgZ(38,"span",38),e._uU(39,"Delete"),e.qZA(),e._uU(40,"\n              "),e.qZA(),e._uU(41,"\n            "),e.qZA(),e._uU(42,"\n          "),e.qZA(),e._uU(43,"\n        "),e.qZA()}if(2&n){const t=r.$implicit;e.xp6(4),e.Q6J("routerLink",e.VKq(6,C,t.id)),e.xp6(1),e.Oqu(t.id),e.xp6(4),e.Oqu(t.name),e.xp6(3),e.hij("\n            ",t.profLogin,"\n          "),e.xp6(6),e.Q6J("routerLink",e.VKq(8,C,t.id)),e.xp6(8),e.Q6J("routerLink",e.VKq(10,Q,t.id))}}function Y(n,r){if(1&n){const t=e.EpF();e.TgZ(0,"div",14),e._uU(1,"\n    "),e.TgZ(2,"table",15),e._uU(3,"\n      "),e.TgZ(4,"thead"),e._uU(5,"\n        "),e.TgZ(6,"tr",16),e.NdJ("predicateChange",function(i){return e.CHM(t),e.oxw().predicate=i})("ascendingChange",function(i){return e.CHM(t),e.oxw().ascending=i})("sortChange",function(){return e.CHM(t),e.oxw().loadPage()}),e._uU(7,"\n          "),e.TgZ(8,"th",17)(9,"span",18),e._uU(10,"ID"),e.qZA(),e._uU(11," "),e._UZ(12,"fa-icon",19),e.qZA(),e._uU(13,"\n          "),e.TgZ(14,"th",20),e._uU(15,"\n            "),e.TgZ(16,"span",21),e._uU(17,"Name"),e.qZA(),e._uU(18," "),e._UZ(19,"fa-icon",19),e._uU(20,"\n          "),e.qZA(),e._uU(21,"\n          "),e.TgZ(22,"th",22),e._uU(23,"\n            "),e.TgZ(24,"span",23),e._uU(25,"Prof"),e.qZA(),e._uU(26," "),e._UZ(27,"fa-icon",19),e._uU(28,"\n          "),e.qZA(),e._uU(29,"\n          "),e._UZ(30,"th",24),e._uU(31,"\n        "),e.qZA(),e._uU(32,"\n      "),e.qZA(),e._uU(33,"\n      "),e.TgZ(34,"tbody"),e._uU(35,"\n        "),e.YNc(36,B,44,12,"tr",25),e._uU(37,"\n      "),e.qZA(),e._uU(38,"\n    "),e.qZA(),e._uU(39,"\n  "),e.qZA()}if(2&n){const t=e.oxw();e.xp6(6),e.Q6J("predicate",t.predicate)("ascending",t.ascending),e.xp6(30),e.Q6J("ngForOf",t.courses)("ngForTrackBy",t.trackId)}}const w=function(n,r,t){return{page:n,totalItems:r,itemsPerPage:t}};function M(n,r){if(1&n){const t=e.EpF();e.TgZ(0,"div"),e._uU(1,"\n    "),e.TgZ(2,"div",39),e._uU(3,"\n      "),e._UZ(4,"jhi-item-count",40),e._uU(5,"\n    "),e.qZA(),e._uU(6,"\n\n    "),e.TgZ(7,"div",39),e._uU(8,"\n      "),e.TgZ(9,"ngb-pagination",41),e.NdJ("pageChange",function(i){return e.CHM(t),e.oxw().ngbPaginationPage=i})("pageChange",function(i){return e.CHM(t),e.oxw().loadPage(i)}),e.qZA(),e._uU(10,"\n    "),e.qZA(),e._uU(11,"\n  "),e.qZA()}if(2&n){const t=e.oxw();e.xp6(4),e.Q6J("params",e.kEZ(7,w,t.page,t.totalItems,t.itemsPerPage)),e.xp6(5),e.Q6J("collectionSize",t.totalItems)("page",t.ngbPaginationPage)("pageSize",t.itemsPerPage)("maxSize",5)("rotate",!0)("boundaryLinks",!0)}}const R=function(){return["/course/new"]};let O=(()=>{class n{constructor(t,o,i,s){this.courseService=t,this.activatedRoute=o,this.router=i,this.modalService=s,this.isLoading=!1,this.totalItems=0,this.itemsPerPage=d.gK,this.ngbPaginationPage=1}loadPage(t,o){var i;this.isLoading=!0;const s=null!==(i=null!=t?t:this.page)&&void 0!==i?i:1;this.courseService.query({page:s-1,size:this.itemsPerPage,sort:this.sort()}).subscribe({next:p=>{this.isLoading=!1,this.onSuccess(p.body,p.headers,s,!o)},error:()=>{this.isLoading=!1,this.onError()}})}ngOnInit(){this.handleNavigation()}trackId(t,o){return o.id}delete(t){const o=this.modalService.open(N,{size:"lg",backdrop:"static"});o.componentInstance.course=t,o.closed.subscribe(i=>{"deleted"===i&&this.loadPage()})}sort(){const t=[this.predicate+","+(this.ascending?d.aW:d.jo)];return"id"!==this.predicate&&t.push("id"),t}handleNavigation(){(0,j.a)([this.activatedRoute.data,this.activatedRoute.queryParamMap]).subscribe(([t,o])=>{var i;const s=o.get("page"),p=+(null!=s?s:1),q=(null!==(i=o.get(d._l))&&void 0!==i?i:t.defaultSort).split(","),x=q[0],S=q[1]===d.aW;(p!==this.page||x!==this.predicate||S!==this.ascending)&&(this.predicate=x,this.ascending=S,this.loadPage(p,!0))})}onSuccess(t,o,i,s){this.totalItems=Number(o.get("X-Total-Count")),this.page=i,s&&this.router.navigate(["/course"],{queryParams:{page:this.page,size:this.itemsPerPage,sort:this.predicate+","+(this.ascending?d.aW:d.jo)}}),this.courses=null!=t?t:[],this.ngbPaginationPage=this.page}onError(){var t;this.ngbPaginationPage=null!==(t=this.page)&&void 0!==t?t:1}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(g.N),e.Y36(c.gz),e.Y36(c.F0),e.Y36(Z.FF))},n.\u0275cmp=e.Xpm({type:n,selectors:[["jhi-course"]],decls:38,vars:7,consts:[["id","page-heading","data-cy","CourseHeading"],["jhiTranslate","gradeScopeIsticApp.course.home.title"],[1,"d-flex","justify-content-end"],[1,"btn","btn-info","me-2",3,"disabled","click"],["icon","sync",3,"spin"],["jhiTranslate","gradeScopeIsticApp.course.home.refreshListLabel"],["id","jh-create-entity","data-cy","entityCreateButton",1,"btn","btn-primary","jh-create-entity","create-course",3,"routerLink"],["icon","plus"],["jhiTranslate","gradeScopeIsticApp.course.home.createLabel"],["class","alert alert-warning","id","no-result",4,"ngIf"],["class","table-responsive","id","entities",4,"ngIf"],[4,"ngIf"],["id","no-result",1,"alert","alert-warning"],["jhiTranslate","gradeScopeIsticApp.course.home.notFound"],["id","entities",1,"table-responsive"],["aria-describedby","page-heading",1,"table","table-striped"],["jhiSort","",3,"predicate","ascending","predicateChange","ascendingChange","sortChange"],["scope","col","jhiSortBy","id"],["jhiTranslate","global.field.id"],["icon","sort"],["scope","col","jhiSortBy","name"],["jhiTranslate","gradeScopeIsticApp.course.name"],["scope","col","jhiSortBy","prof.login"],["jhiTranslate","gradeScopeIsticApp.course.prof"],["scope","col"],["data-cy","entityTable",4,"ngFor","ngForOf","ngForTrackBy"],["data-cy","entityTable"],[3,"routerLink"],[1,"text-end"],[1,"btn-group"],["type","submit","data-cy","entityDetailsButton",1,"btn","btn-info","btn-sm",3,"routerLink"],["icon","eye"],["jhiTranslate","entity.action.view",1,"d-none","d-md-inline"],["type","submit","data-cy","entityEditButton",1,"btn","btn-primary","btn-sm",3,"routerLink"],["icon","pencil-alt"],["jhiTranslate","entity.action.edit",1,"d-none","d-md-inline"],["type","submit","data-cy","entityDeleteButton",1,"btn","btn-danger","btn-sm",3,"click"],["icon","times"],["jhiTranslate","entity.action.delete",1,"d-none","d-md-inline"],[1,"d-flex","justify-content-center"],[3,"params"],[3,"collectionSize","page","pageSize","maxSize","rotate","boundaryLinks","pageChange"]],template:function(t,o){1&t&&(e.TgZ(0,"div"),e._uU(1,"\n  "),e.TgZ(2,"h2",0),e._uU(3,"\n    "),e.TgZ(4,"span",1),e._uU(5,"Courses"),e.qZA(),e._uU(6,"\n\n    "),e.TgZ(7,"div",2),e._uU(8,"\n      "),e.TgZ(9,"button",3),e.NdJ("click",function(){return o.loadPage()}),e._uU(10,"\n        "),e._UZ(11,"fa-icon",4),e._uU(12,"\n        "),e.TgZ(13,"span",5),e._uU(14,"Refresh List"),e.qZA(),e._uU(15,"\n      "),e.qZA(),e._uU(16,"\n\n      "),e.TgZ(17,"button",6),e._uU(18,"\n        "),e._UZ(19,"fa-icon",7),e._uU(20,"\n        "),e.TgZ(21,"span",8),e._uU(22," Create a new Course "),e.qZA(),e._uU(23,"\n      "),e.qZA(),e._uU(24,"\n    "),e.qZA(),e._uU(25,"\n  "),e.qZA(),e._uU(26,"\n\n  "),e._UZ(27,"jhi-alert-error"),e._uU(28,"\n\n  "),e._UZ(29,"jhi-alert"),e._uU(30,"\n\n  "),e.YNc(31,k,5,0,"div",9),e._uU(32,"\n\n  "),e.YNc(33,Y,40,4,"div",10),e._uU(34,"\n\n  "),e.YNc(35,M,12,11,"div",11),e._uU(36,"\n"),e.qZA(),e._uU(37,"\n")),2&t&&(e.xp6(9),e.Q6J("disabled",o.isLoading),e.xp6(2),e.Q6J("spin",o.isLoading),e.xp6(6),e.Q6J("routerLink",e.DdM(6,R)),e.xp6(14),e.Q6J("ngIf",0===(null==o.courses?null:o.courses.length)),e.xp6(2),e.Q6J("ngIf",o.courses&&o.courses.length>0),e.xp6(2),e.Q6J("ngIf",o.courses&&o.courses.length>0))},directives:[m.P,f.BN,c.rH,U.A,T.w,l.O5,D.b,P.T,l.sg,c.yS,L.N,Z.N9],encapsulation:2}),n})();const z=function(n){return["/course",n,"edit"]};function E(n,r){if(1&n){const t=e.EpF();e.TgZ(0,"div"),e._uU(1,"\n      "),e.TgZ(2,"h2",3)(3,"span",4),e._uU(4,"Course"),e.qZA()(),e._uU(5,"\n\n      "),e._UZ(6,"hr"),e._uU(7,"\n\n      "),e._UZ(8,"jhi-alert-error"),e._uU(9,"\n\n      "),e._UZ(10,"jhi-alert"),e._uU(11,"\n\n      "),e.TgZ(12,"dl",5),e._uU(13,"\n        "),e.TgZ(14,"dt")(15,"span",6),e._uU(16,"ID"),e.qZA()(),e._uU(17,"\n        "),e.TgZ(18,"dd"),e._uU(19,"\n          "),e.TgZ(20,"span"),e._uU(21),e.qZA(),e._uU(22,"\n        "),e.qZA(),e._uU(23,"\n        "),e.TgZ(24,"dt")(25,"span",7),e._uU(26,"Name"),e.qZA()(),e._uU(27,"\n        "),e.TgZ(28,"dd"),e._uU(29,"\n          "),e.TgZ(30,"span"),e._uU(31),e.qZA(),e._uU(32,"\n        "),e.qZA(),e._uU(33,"\n        "),e.TgZ(34,"dt")(35,"span",8),e._uU(36,"Prof"),e.qZA()(),e._uU(37,"\n        "),e.TgZ(38,"dd"),e._uU(39,"\n          "),e.TgZ(40,"span"),e._uU(41),e.qZA(),e._uU(42,"\n        "),e.qZA(),e._uU(43,"\n      "),e.qZA(),e._uU(44,"\n\n      "),e.TgZ(45,"button",9),e.NdJ("click",function(){return e.CHM(t),e.oxw().previousState()}),e._uU(46,"\n        "),e._UZ(47,"fa-icon",10),e._uU(48,"\xa0"),e.TgZ(49,"span",11),e._uU(50,"Back"),e.qZA(),e._uU(51,"\n      "),e.qZA(),e._uU(52,"\n\n      "),e.TgZ(53,"button",12),e._uU(54,"\n        "),e._UZ(55,"fa-icon",13),e._uU(56,"\xa0"),e.TgZ(57,"span",14),e._uU(58,"Edit"),e.qZA(),e._uU(59,"\n      "),e.qZA(),e._uU(60,"\n    "),e.qZA()}if(2&n){const t=e.oxw();e.xp6(21),e.Oqu(t.course.id),e.xp6(10),e.Oqu(t.course.name),e.xp6(10),e.Oqu(t.course.profLogin),e.xp6(12),e.Q6J("routerLink",e.VKq(4,z,t.course.id))}}let H=(()=>{class n{constructor(t){this.activatedRoute=t,this.course=null}ngOnInit(){this.activatedRoute.data.subscribe(({course:t})=>{this.course=t})}previousState(){window.history.back()}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(c.gz))},n.\u0275cmp=e.Xpm({type:n,selectors:[["jhi-course-detail"]],decls:8,vars:1,consts:[[1,"d-flex","justify-content-center"],[1,"col-8"],[4,"ngIf"],["data-cy","courseDetailsHeading"],["jhiTranslate","gradeScopeIsticApp.course.detail.title"],[1,"row-md","jh-entity-details"],["jhiTranslate","global.field.id"],["jhiTranslate","gradeScopeIsticApp.course.name"],["jhiTranslate","gradeScopeIsticApp.course.prof"],["type","submit","data-cy","entityDetailsBackButton",1,"btn","btn-info",3,"click"],["icon","arrow-left"],["jhiTranslate","entity.action.back"],["type","button",1,"btn","btn-primary",3,"routerLink"],["icon","pencil-alt"],["jhiTranslate","entity.action.edit"]],template:function(t,o){1&t&&(e.TgZ(0,"div",0),e._uU(1,"\n  "),e.TgZ(2,"div",1),e._uU(3,"\n    "),e.YNc(4,E,61,6,"div",2),e._uU(5,"\n  "),e.qZA(),e._uU(6,"\n"),e.qZA(),e._uU(7,"\n")),2&t&&(e.xp6(4),e.Q6J("ngIf",o.course))},directives:[l.O5,m.P,U.A,T.w,f.BN,c.rH],encapsulation:2}),n})();var b=a(45100),V=a(46907);function K(n,r){1&n&&(e.TgZ(0,"small",22),e._uU(1,"\n              This field is required.\n            "),e.qZA())}function X(n,r){if(1&n&&(e.TgZ(0,"div"),e._uU(1,"\n            "),e.YNc(2,K,2,0,"small",21),e._uU(3,"\n          "),e.qZA()),2&n){const t=e.oxw();let o;e.xp6(2),e.Q6J("ngIf",null==(o=t.editForm.get("name"))||null==o.errors?null:o.errors.required)}}function G(n,r){1&n&&e._UZ(0,"option",23),2&n&&e.Q6J("ngValue",null)}function W(n,r){if(1&n&&(e.TgZ(0,"option",24),e._uU(1),e.qZA()),2&n){const t=r.$implicit;e.Q6J("ngValue",t.id),e.xp6(1),e.Oqu(t.login)}}function $(n,r){1&n&&(e.TgZ(0,"small",22),e._uU(1,"\n              This field is required.\n          "),e.qZA())}function ee(n,r){if(1&n&&(e.TgZ(0,"div"),e._uU(1,"\n          "),e.YNc(2,$,2,0,"small",21),e._uU(3,"\n      "),e.qZA()),2&n){const t=e.oxw();let o;e.xp6(2),e.Q6J("ngIf",null==(o=t.editForm.get("profId"))||null==o.errors?null:o.errors.required)}}let A=(()=>{class n{constructor(t,o,i,s){this.courseService=t,this.userService=o,this.activatedRoute=i,this.fb=s,this.isSaving=!1,this.users=[],this.editForm=this.fb.group({id:[],name:[null,[u.kI.required]],profId:[null,u.kI.required]})}ngOnInit(){this.activatedRoute.data.subscribe(({course:t})=>{this.updateForm(t),this.userService.query().subscribe(o=>{this.users=o.body||[],console.log(this.users)})})}updateForm(t){this.editForm.patchValue({id:t.id,name:t.name,profId:t.profId})}previousState(){window.history.back()}save(){this.isSaving=!0;const t=this.createFromForm();this.subscribeToSaveResponse(void 0!==t.id?this.courseService.update(t):this.courseService.create(t))}createFromForm(){return Object.assign(Object.assign({},new b.T),{id:this.editForm.get(["id"]).value,name:this.editForm.get(["name"]).value,profId:this.editForm.get(["profId"]).value})}subscribeToSaveResponse(t){t.subscribe(()=>this.onSaveSuccess(),()=>this.onSaveError())}onSaveSuccess(){this.isSaving=!1,this.previousState()}onSaveError(){this.isSaving=!1}trackById(t,o){return o.id}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(g.N),e.Y36(V.K),e.Y36(c.gz),e.Y36(u.qu))},n.\u0275cmp=e.Xpm({type:n,selectors:[["jhi-course-update"]],decls:69,vars:9,consts:[[1,"d-flex","justify-content-center"],[1,"col-8"],["name","editForm","role","form","novalidate","",3,"formGroup","ngSubmit"],["id","jhi-course-heading","data-cy","CourseCreateUpdateHeading","jhiTranslate","gradeScopeIsticApp.course.home.createOrEditLabel"],[1,"row","mb-3",3,"hidden"],["jhiTranslate","global.field.id","for","field_id",1,"form-label"],["type","number","name","id","id","field_id","data-cy","id","formControlName","id",1,"form-control",3,"readonly"],[1,"row","mb-3"],["jhiTranslate","gradeScopeIsticApp.course.name","for","field_name",1,"form-label"],["type","text","name","name","id","field_name","data-cy","name","formControlName","name",1,"form-control"],[4,"ngIf"],["jhiTranslate","gradeScopeIsticApp.course.prof","for","field_prof",1,"form-label"],["id","field_prof","name","prof","formControlName","profId",1,"form-control"],["selected","",3,"ngValue",4,"ngIf"],[3,"ngValue",4,"ngFor","ngForOf","ngForTrackBy"],["type","button","id","cancel-save","data-cy","entityCreateCancelButton",1,"btn","btn-secondary",3,"click"],["icon","ban"],["jhiTranslate","entity.action.cancel"],["type","submit","id","save-entity","data-cy","entityCreateSaveButton",1,"btn","btn-primary",3,"disabled"],["icon","save"],["jhiTranslate","entity.action.save"],["class","form-text text-danger","jhiTranslate","entity.validation.required",4,"ngIf"],["jhiTranslate","entity.validation.required",1,"form-text","text-danger"],["selected","",3,"ngValue"],[3,"ngValue"]],template:function(t,o){1&t&&(e.TgZ(0,"div",0),e._uU(1,"\n  "),e.TgZ(2,"div",1),e._uU(3,"\n    "),e.TgZ(4,"form",2),e.NdJ("ngSubmit",function(){return o.save()}),e._uU(5,"\n      "),e.TgZ(6,"h2",3),e._uU(7,"\n        Create or edit a Course\n      "),e.qZA(),e._uU(8,"\n\n      "),e.TgZ(9,"div"),e._uU(10,"\n        "),e._UZ(11,"jhi-alert-error"),e._uU(12,"\n\n        "),e.TgZ(13,"div",4),e._uU(14,"\n          "),e.TgZ(15,"label",5),e._uU(16,"ID"),e.qZA(),e._uU(17,"\n          "),e._UZ(18,"input",6),e._uU(19,"\n        "),e.qZA(),e._uU(20,"\n\n        "),e.TgZ(21,"div",7),e._uU(22,"\n          "),e.TgZ(23,"label",8),e._uU(24,"Name"),e.qZA(),e._uU(25,"\n          "),e._UZ(26,"input",9),e._uU(27,"\n          "),e.YNc(28,X,4,1,"div",10),e._uU(29,"\n        "),e.qZA(),e._uU(30,"\n\n        "),e.TgZ(31,"div",7),e._uU(32,"\n          "),e.TgZ(33,"label",11),e._uU(34,"Prof"),e.qZA(),e._uU(35,"\n          "),e.TgZ(36,"select",12),e._uU(37,"\n            "),e.YNc(38,G,1,1,"option",13),e._uU(39,"\n            "),e.YNc(40,W,2,2,"option",14),e._uU(41,"\n        "),e.qZA(),e._uU(42,"\n        "),e.qZA(),e._uU(43,"\n        "),e.YNc(44,ee,4,1,"div",10),e._uU(45,"\n      "),e.qZA(),e._uU(46,"\n\n      "),e.TgZ(47,"div"),e._uU(48,"\n        "),e.TgZ(49,"button",15),e.NdJ("click",function(){return o.previousState()}),e._uU(50,"\n          "),e._UZ(51,"fa-icon",16),e._uU(52,"\xa0"),e.TgZ(53,"span",17),e._uU(54,"Cancel"),e.qZA(),e._uU(55,"\n        "),e.qZA(),e._uU(56,"\n\n        "),e.TgZ(57,"button",18),e._uU(58,"\n          "),e._UZ(59,"fa-icon",19),e._uU(60,"\xa0"),e.TgZ(61,"span",20),e._uU(62,"Save"),e.qZA(),e._uU(63,"\n        "),e.qZA(),e._uU(64,"\n      "),e.qZA(),e._uU(65,"\n    "),e.qZA(),e._uU(66,"\n  "),e.qZA(),e._uU(67,"\n"),e.qZA(),e._uU(68,"\n")),2&t&&(e.xp6(4),e.Q6J("formGroup",o.editForm),e.xp6(9),e.Q6J("hidden",null==o.editForm.get("id").value),e.xp6(5),e.Q6J("readonly",!0),e.xp6(10),e.Q6J("ngIf",o.editForm.get("name").invalid&&(o.editForm.get("name").dirty||o.editForm.get("name").touched)),e.xp6(10),e.Q6J("ngIf",!o.editForm.get("profId").value),e.xp6(2),e.Q6J("ngForOf",o.users)("ngForTrackBy",o.trackById),e.xp6(4),e.Q6J("ngIf",o.editForm.get("profId").invalid&&(o.editForm.get("profId").dirty||o.editForm.get("profId").touched)),e.xp6(13),e.Q6J("disabled",o.editForm.invalid||o.isSaving))},directives:[u._Y,u.JL,u.sg,m.P,U.A,u.wV,u.Fj,u.JJ,u.u,l.O5,u.EJ,u.YN,u.Kr,l.sg,f.BN],encapsulation:2}),n})();var y=a(39646),te=a(60515),ne=a(95577);let h=(()=>{class n{constructor(t,o){this.service=t,this.router=o}resolve(t){const o=t.params.id;return o?this.service.find(o).pipe((0,ne.z)(i=>i.body?(0,y.of)(i.body):(this.router.navigate(["404"]),te.E))):(0,y.of)(new b.T)}}return n.\u0275fac=function(t){return new(t||n)(e.LFG(g.N),e.LFG(c.F0))},n.\u0275prov=e.Yz7({token:n,factory:n.\u0275fac,providedIn:"root"}),n})();const oe=[{path:"",component:O,data:{defaultSort:"id,asc"},canActivate:[_.Z]},{path:":id/view",component:H,resolve:{course:h},canActivate:[_.Z]},{path:"new",component:A,resolve:{course:h},canActivate:[_.Z]},{path:":id/edit",component:A,resolve:{course:h},canActivate:[_.Z]}];let ie=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[[c.Bz.forChild(oe)],c.Bz]}),n})(),re=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[[I.m,ie]]}),n})()}}]);