"use strict";(self.webpackChunkgrade_scope_istic=self.webpackChunkgrade_scope_istic||[]).push([[534],{63534:(un,T,s)=>{s.r(T),s.d(T,{ScanModule:()=>rn});var I=s(94272),u=s(64035),p=s(58059),J=s(39841),d=s(74218),n=s(5e3),g=s(53802),h=s(86827),_=s(69808),r=s(93075),m=s(41995),U=s(486),Z=s(49444);const N=function(e){return{id:e}};function D(e,o){if(1&e){const t=n.EpF();n.TgZ(0,"form",1),n.NdJ("ngSubmit",function(){n.CHM(t);const i=n.oxw();return i.confirmDelete(i.scan.id)}),n._uU(1,"\n  "),n.TgZ(2,"div",2),n._uU(3,"\n    "),n.TgZ(4,"h4",3),n._uU(5,"Confirm delete operation"),n.qZA(),n._uU(6,"\n\n    "),n.TgZ(7,"button",4),n.NdJ("click",function(){return n.CHM(t),n.oxw().cancel()}),n._uU(8,"\xd7"),n.qZA(),n._uU(9,"\n  "),n.qZA(),n._uU(10,"\n\n  "),n.TgZ(11,"div",5),n._uU(12,"\n    "),n._UZ(13,"jhi-alert-error"),n._uU(14,"\n\n    "),n.TgZ(15,"p",6),n._uU(16,"\n      Are you sure you want to delete this Scan?\n    "),n.qZA(),n._uU(17,"\n  "),n.qZA(),n._uU(18,"\n\n  "),n.TgZ(19,"div",7),n._uU(20,"\n    "),n.TgZ(21,"button",8),n.NdJ("click",function(){return n.CHM(t),n.oxw().cancel()}),n._uU(22,"\n      "),n._UZ(23,"fa-icon",9),n._uU(24,"\xa0"),n.TgZ(25,"span",10),n._uU(26,"Cancel"),n.qZA(),n._uU(27,"\n    "),n.qZA(),n._uU(28,"\n\n    "),n.TgZ(29,"button",11),n._uU(30,"\n      "),n._UZ(31,"fa-icon",12),n._uU(32,"\xa0"),n.TgZ(33,"span",13),n._uU(34,"Delete"),n.qZA(),n._uU(35,"\n    "),n.qZA(),n._uU(36,"\n  "),n.qZA(),n._uU(37,"\n"),n.qZA()}if(2&e){const t=n.oxw();n.xp6(15),n.Q6J("translateValues",n.VKq(1,N,t.scan.id))}}let k=(()=>{class e{constructor(t,a){this.scanService=t,this.activeModal=a}cancel(){this.activeModal.dismiss()}confirmDelete(t){this.scanService.delete(t).subscribe(()=>{this.activeModal.close("deleted")})}}return e.\u0275fac=function(t){return new(t||e)(n.Y36(g.I),n.Y36(h.Kz))},e.\u0275cmp=n.Xpm({type:e,selectors:[["ng-component"]],decls:2,vars:1,consts:[["name","deleteForm",3,"ngSubmit",4,"ngIf"],["name","deleteForm",3,"ngSubmit"],[1,"modal-header"],["data-cy","scanDeleteDialogHeading","jhiTranslate","entity.delete.title",1,"modal-title"],["type","button","data-dismiss","modal","aria-hidden","true",1,"btn-close",3,"click"],[1,"modal-body"],["id","jhi-delete-scan-heading","jhiTranslate","gradeScopeIsticApp.scan.delete.question",3,"translateValues"],[1,"modal-footer"],["type","button","data-dismiss","modal",1,"btn","btn-secondary",3,"click"],["icon","ban"],["jhiTranslate","entity.action.cancel"],["id","jhi-confirm-delete-scan","data-cy","entityConfirmDeleteButton","type","submit",1,"btn","btn-danger"],["icon","times"],["jhiTranslate","entity.action.delete"]],template:function(t,a){1&t&&(n.YNc(0,D,38,3,"form",0),n._uU(1,"\n")),2&t&&n.Q6J("ngIf",a.scan)},directives:[_.O5,r._Y,r.JL,r.F,m.P,U.A,Z.BN],encapsulation:2}),e})();var f=s(15926),y=s(39003),P=s(31427),w=s(1408),z=s(18133);function L(e,o){1&e&&(n.TgZ(0,"div",12),n._uU(1,"\n    "),n.TgZ(2,"span",13),n._uU(3,"No scans found"),n.qZA(),n._uU(4,"\n  "),n.qZA())}function M(e,o){if(1&e){const t=n.EpF();n.TgZ(0,"a",40),n.NdJ("click",function(){n.CHM(t);const i=n.oxw().$implicit;return n.oxw(2).openFile(i.content,i.contentContentType)}),n._uU(1,"open"),n.qZA()}}function Y(e,o){if(1&e&&(n.TgZ(0,"span"),n._uU(1),n.qZA()),2&e){const t=n.oxw().$implicit,a=n.oxw(2);n.xp6(1),n.AsE("",t.contentContentType,", ",a.byteSize(t.content),"")}}const S=function(e){return["/scan",e,"view"]},Q=function(e){return["/scan",e,"edit"]};function B(e,o){if(1&e){const t=n.EpF();n.TgZ(0,"tr",26),n._uU(1,"\n          "),n.TgZ(2,"td"),n._uU(3,"\n            "),n.TgZ(4,"a",27),n._uU(5),n.qZA(),n._uU(6,"\n          "),n.qZA(),n._uU(7,"\n          "),n.TgZ(8,"td"),n._uU(9),n.qZA(),n._uU(10,"\n          "),n.TgZ(11,"td"),n._uU(12,"\n            "),n.YNc(13,M,2,0,"a",28),n._uU(14,"\n            "),n.YNc(15,Y,2,2,"span",11),n._uU(16,"\n          "),n.qZA(),n._uU(17,"\n          "),n.TgZ(18,"td",29),n._uU(19,"\n            "),n.TgZ(20,"div",30),n._uU(21,"\n              "),n.TgZ(22,"button",31),n._uU(23,"\n                "),n._UZ(24,"fa-icon",32),n._uU(25,"\n                "),n.TgZ(26,"span",33),n._uU(27,"View"),n.qZA(),n._uU(28,"\n              "),n.qZA(),n._uU(29,"\n\n              "),n.TgZ(30,"button",34),n._uU(31,"\n                "),n._UZ(32,"fa-icon",35),n._uU(33,"\n                "),n.TgZ(34,"span",36),n._uU(35,"Edit"),n.qZA(),n._uU(36,"\n              "),n.qZA(),n._uU(37,"\n\n              "),n.TgZ(38,"button",37),n.NdJ("click",function(){const c=n.CHM(t).$implicit;return n.oxw(2).delete(c)}),n._uU(39,"\n                "),n._UZ(40,"fa-icon",38),n._uU(41,"\n                "),n.TgZ(42,"span",39),n._uU(43,"Delete"),n.qZA(),n._uU(44,"\n              "),n.qZA(),n._uU(45,"\n            "),n.qZA(),n._uU(46,"\n          "),n.qZA(),n._uU(47,"\n        "),n.qZA()}if(2&e){const t=o.$implicit;n.xp6(4),n.Q6J("routerLink",n.VKq(7,S,t.id)),n.xp6(1),n.Oqu(t.id),n.xp6(4),n.Oqu(t.name),n.xp6(4),n.Q6J("ngIf",t.content),n.xp6(2),n.Q6J("ngIf",t.content),n.xp6(7),n.Q6J("routerLink",n.VKq(9,S,t.id)),n.xp6(8),n.Q6J("routerLink",n.VKq(11,Q,t.id))}}function R(e,o){if(1&e){const t=n.EpF();n.TgZ(0,"div",14),n._uU(1,"\n    "),n.TgZ(2,"table",15),n._uU(3,"\n      "),n.TgZ(4,"thead"),n._uU(5,"\n        "),n.TgZ(6,"tr",16),n.NdJ("predicateChange",function(i){return n.CHM(t),n.oxw().predicate=i})("ascendingChange",function(i){return n.CHM(t),n.oxw().ascending=i})("sortChange",function(){return n.CHM(t),n.oxw().loadPage()}),n._uU(7,"\n          "),n.TgZ(8,"th",17)(9,"span",18),n._uU(10,"ID"),n.qZA(),n._uU(11," "),n._UZ(12,"fa-icon",19),n.qZA(),n._uU(13,"\n          "),n.TgZ(14,"th",20),n._uU(15,"\n            "),n.TgZ(16,"span",21),n._uU(17,"Name"),n.qZA(),n._uU(18," "),n._UZ(19,"fa-icon",19),n._uU(20,"\n          "),n.qZA(),n._uU(21,"\n          "),n.TgZ(22,"th",22),n._uU(23,"\n            "),n.TgZ(24,"span",23),n._uU(25,"Content"),n.qZA(),n._uU(26," "),n._UZ(27,"fa-icon",19),n._uU(28,"\n          "),n.qZA(),n._uU(29,"\n          "),n._UZ(30,"th",24),n._uU(31,"\n        "),n.qZA(),n._uU(32,"\n      "),n.qZA(),n._uU(33,"\n      "),n.TgZ(34,"tbody"),n._uU(35,"\n        "),n.YNc(36,B,48,13,"tr",25),n._uU(37,"\n      "),n.qZA(),n._uU(38,"\n    "),n.qZA(),n._uU(39,"\n  "),n.qZA()}if(2&e){const t=n.oxw();n.xp6(6),n.Q6J("predicate",t.predicate)("ascending",t.ascending),n.xp6(30),n.Q6J("ngForOf",t.scans)("ngForTrackBy",t.trackId)}}const E=function(e,o,t){return{page:e,totalItems:o,itemsPerPage:t}};function H(e,o){if(1&e){const t=n.EpF();n.TgZ(0,"div"),n._uU(1,"\n    "),n.TgZ(2,"div",41),n._uU(3,"\n      "),n._UZ(4,"jhi-item-count",42),n._uU(5,"\n    "),n.qZA(),n._uU(6,"\n\n    "),n.TgZ(7,"div",41),n._uU(8,"\n      "),n.TgZ(9,"ngb-pagination",43),n.NdJ("pageChange",function(i){return n.CHM(t),n.oxw().ngbPaginationPage=i})("pageChange",function(i){return n.CHM(t),n.oxw().loadPage(i)}),n.qZA(),n._uU(10,"\n    "),n.qZA(),n._uU(11,"\n  "),n.qZA()}if(2&e){const t=n.oxw();n.xp6(4),n.Q6J("params",n.kEZ(7,E,t.page,t.totalItems,t.itemsPerPage)),n.xp6(5),n.Q6J("collectionSize",t.totalItems)("page",t.ngbPaginationPage)("pageSize",t.itemsPerPage)("maxSize",5)("rotate",!0)("boundaryLinks",!0)}}const O=function(){return["/scan/new"]};let V=(()=>{class e{constructor(t,a,i,c,l){this.scanService=t,this.activatedRoute=a,this.dataUtils=i,this.router=c,this.modalService=l,this.isLoading=!1,this.totalItems=0,this.itemsPerPage=d.gK,this.ngbPaginationPage=1}loadPage(t,a){var i;this.isLoading=!0;const c=null!==(i=null!=t?t:this.page)&&void 0!==i?i:1;this.scanService.query({page:c-1,size:this.itemsPerPage,sort:this.sort()}).subscribe({next:l=>{this.isLoading=!1,this.onSuccess(l.body,l.headers,c,!a)},error:()=>{this.isLoading=!1,this.onError()}})}ngOnInit(){this.handleNavigation()}trackId(t,a){return a.id}byteSize(t){return this.dataUtils.byteSize(t)}openFile(t,a){return this.dataUtils.openFile(t,a)}delete(t){const a=this.modalService.open(k,{size:"lg",backdrop:"static"});a.componentInstance.scan=t,a.closed.subscribe(i=>{"deleted"===i&&this.loadPage()})}sort(){const t=[this.predicate+","+(this.ascending?d.aW:d.jo)];return"id"!==this.predicate&&t.push("id"),t}handleNavigation(){(0,J.a)([this.activatedRoute.data,this.activatedRoute.queryParamMap]).subscribe(([t,a])=>{var i;const c=a.get("page"),l=+(null!=c?c:1),q=(null!==(i=a.get(d._l))&&void 0!==i?i:t.defaultSort).split(","),F=q[0],j=q[1]===d.aW;(l!==this.page||F!==this.predicate||j!==this.ascending)&&(this.predicate=F,this.ascending=j,this.loadPage(l,!0))})}onSuccess(t,a,i,c){this.totalItems=Number(a.get("X-Total-Count")),this.page=i,c&&this.router.navigate(["/scan"],{queryParams:{page:this.page,size:this.itemsPerPage,sort:this.predicate+","+(this.ascending?d.aW:d.jo)}}),this.scans=null!=t?t:[],this.ngbPaginationPage=this.page}onError(){var t;this.ngbPaginationPage=null!==(t=this.page)&&void 0!==t?t:1}}return e.\u0275fac=function(t){return new(t||e)(n.Y36(g.I),n.Y36(u.gz),n.Y36(f.A),n.Y36(u.F0),n.Y36(h.FF))},e.\u0275cmp=n.Xpm({type:e,selectors:[["jhi-scan"]],decls:38,vars:7,consts:[["id","page-heading","data-cy","ScanHeading"],["jhiTranslate","gradeScopeIsticApp.scan.home.title"],[1,"d-flex","justify-content-end"],[1,"btn","btn-info","me-2",3,"disabled","click"],["icon","sync",3,"spin"],["jhiTranslate","gradeScopeIsticApp.scan.home.refreshListLabel"],["id","jh-create-entity","data-cy","entityCreateButton",1,"btn","btn-primary","jh-create-entity","create-scan",3,"routerLink"],["icon","plus"],["jhiTranslate","gradeScopeIsticApp.scan.home.createLabel"],["class","alert alert-warning","id","no-result",4,"ngIf"],["class","table-responsive","id","entities",4,"ngIf"],[4,"ngIf"],["id","no-result",1,"alert","alert-warning"],["jhiTranslate","gradeScopeIsticApp.scan.home.notFound"],["id","entities",1,"table-responsive"],["aria-describedby","page-heading",1,"table","table-striped"],["jhiSort","",3,"predicate","ascending","predicateChange","ascendingChange","sortChange"],["scope","col","jhiSortBy","id"],["jhiTranslate","global.field.id"],["icon","sort"],["scope","col","jhiSortBy","name"],["jhiTranslate","gradeScopeIsticApp.scan.name"],["scope","col","jhiSortBy","content"],["jhiTranslate","gradeScopeIsticApp.scan.content"],["scope","col"],["data-cy","entityTable",4,"ngFor","ngForOf","ngForTrackBy"],["data-cy","entityTable"],[3,"routerLink"],["jhiTranslate","entity.action.open",3,"click",4,"ngIf"],[1,"text-end"],[1,"btn-group"],["type","submit","data-cy","entityDetailsButton",1,"btn","btn-info","btn-sm",3,"routerLink"],["icon","eye"],["jhiTranslate","entity.action.view",1,"d-none","d-md-inline"],["type","submit","data-cy","entityEditButton",1,"btn","btn-primary","btn-sm",3,"routerLink"],["icon","pencil-alt"],["jhiTranslate","entity.action.edit",1,"d-none","d-md-inline"],["type","submit","data-cy","entityDeleteButton",1,"btn","btn-danger","btn-sm",3,"click"],["icon","times"],["jhiTranslate","entity.action.delete",1,"d-none","d-md-inline"],["jhiTranslate","entity.action.open",3,"click"],[1,"d-flex","justify-content-center"],[3,"params"],[3,"collectionSize","page","pageSize","maxSize","rotate","boundaryLinks","pageChange"]],template:function(t,a){1&t&&(n.TgZ(0,"div"),n._uU(1,"\n  "),n.TgZ(2,"h2",0),n._uU(3,"\n    "),n.TgZ(4,"span",1),n._uU(5,"Scans"),n.qZA(),n._uU(6,"\n\n    "),n.TgZ(7,"div",2),n._uU(8,"\n      "),n.TgZ(9,"button",3),n.NdJ("click",function(){return a.loadPage()}),n._uU(10,"\n        "),n._UZ(11,"fa-icon",4),n._uU(12,"\n        "),n.TgZ(13,"span",5),n._uU(14,"Refresh List"),n.qZA(),n._uU(15,"\n      "),n.qZA(),n._uU(16,"\n\n      "),n.TgZ(17,"button",6),n._uU(18,"\n        "),n._UZ(19,"fa-icon",7),n._uU(20,"\n        "),n.TgZ(21,"span",8),n._uU(22," Create a new Scan "),n.qZA(),n._uU(23,"\n      "),n.qZA(),n._uU(24,"\n    "),n.qZA(),n._uU(25,"\n  "),n.qZA(),n._uU(26,"\n\n  "),n._UZ(27,"jhi-alert-error"),n._uU(28,"\n\n  "),n._UZ(29,"jhi-alert"),n._uU(30,"\n\n  "),n.YNc(31,L,5,0,"div",9),n._uU(32,"\n\n  "),n.YNc(33,R,40,4,"div",10),n._uU(34,"\n\n  "),n.YNc(35,H,12,11,"div",11),n._uU(36,"\n"),n.qZA(),n._uU(37,"\n")),2&t&&(n.xp6(9),n.Q6J("disabled",a.isLoading),n.xp6(2),n.Q6J("spin",a.isLoading),n.xp6(6),n.Q6J("routerLink",n.DdM(6,O)),n.xp6(14),n.Q6J("ngIf",0===(null==a.scans?null:a.scans.length)),n.xp6(2),n.Q6J("ngIf",a.scans&&a.scans.length>0),n.xp6(2),n.Q6J("ngIf",a.scans&&a.scans.length>0))},directives:[m.P,Z.BN,u.rH,U.A,y.w,_.O5,P.b,w.T,_.sg,u.yS,z.N,h.N9],encapsulation:2}),e})();function K(e,o){if(1&e){const t=n.EpF();n.TgZ(0,"div"),n._uU(1,"\n            "),n.TgZ(2,"a",15),n.NdJ("click",function(){n.CHM(t);const i=n.oxw(2);return i.openFile(i.scan.content,i.scan.contentContentType)}),n._uU(3,"open"),n.qZA(),n._uU(4),n.qZA()}if(2&e){const t=n.oxw(2);n.xp6(4),n.AsE("\n            ",t.scan.contentContentType,", ",t.byteSize(t.scan.content),"\n          ")}}const X=function(e){return["/scan",e,"edit"]};function G(e,o){if(1&e){const t=n.EpF();n.TgZ(0,"div"),n._uU(1,"\n      "),n.TgZ(2,"h2",3)(3,"span",4),n._uU(4,"Scan"),n.qZA()(),n._uU(5,"\n\n      "),n._UZ(6,"hr"),n._uU(7,"\n\n      "),n._UZ(8,"jhi-alert-error"),n._uU(9,"\n\n      "),n._UZ(10,"jhi-alert"),n._uU(11,"\n\n      "),n.TgZ(12,"dl",5),n._uU(13,"\n        "),n.TgZ(14,"dt")(15,"span",6),n._uU(16,"ID"),n.qZA()(),n._uU(17,"\n        "),n.TgZ(18,"dd"),n._uU(19,"\n          "),n.TgZ(20,"span"),n._uU(21),n.qZA(),n._uU(22,"\n        "),n.qZA(),n._uU(23,"\n        "),n.TgZ(24,"dt")(25,"span",7),n._uU(26,"Name"),n.qZA()(),n._uU(27,"\n        "),n.TgZ(28,"dd"),n._uU(29,"\n          "),n.TgZ(30,"span"),n._uU(31),n.qZA(),n._uU(32,"\n        "),n.qZA(),n._uU(33,"\n        "),n.TgZ(34,"dt")(35,"span",8),n._uU(36,"Content"),n.qZA()(),n._uU(37,"\n        "),n.TgZ(38,"dd"),n._uU(39,"\n          "),n.YNc(40,K,5,2,"div",2),n._uU(41,"\n        "),n.qZA(),n._uU(42,"\n      "),n.qZA(),n._uU(43,"\n\n      "),n.TgZ(44,"button",9),n.NdJ("click",function(){return n.CHM(t),n.oxw().previousState()}),n._uU(45,"\n        "),n._UZ(46,"fa-icon",10),n._uU(47,"\xa0"),n.TgZ(48,"span",11),n._uU(49,"Back"),n.qZA(),n._uU(50,"\n      "),n.qZA(),n._uU(51,"\n\n      "),n.TgZ(52,"button",12),n._uU(53,"\n        "),n._UZ(54,"fa-icon",13),n._uU(55,"\xa0"),n.TgZ(56,"span",14),n._uU(57,"Edit"),n.qZA(),n._uU(58,"\n      "),n.qZA(),n._uU(59,"\n    "),n.qZA()}if(2&e){const t=n.oxw();n.xp6(21),n.Oqu(t.scan.id),n.xp6(10),n.Oqu(t.scan.name),n.xp6(9),n.Q6J("ngIf",t.scan.content),n.xp6(12),n.Q6J("routerLink",n.VKq(4,X,t.scan.id))}}let $=(()=>{class e{constructor(t,a){this.dataUtils=t,this.activatedRoute=a,this.scan=null}ngOnInit(){this.activatedRoute.data.subscribe(({scan:t})=>{this.scan=t})}byteSize(t){return this.dataUtils.byteSize(t)}openFile(t,a){this.dataUtils.openFile(t,a)}previousState(){window.history.back()}}return e.\u0275fac=function(t){return new(t||e)(n.Y36(f.A),n.Y36(u.gz))},e.\u0275cmp=n.Xpm({type:e,selectors:[["jhi-scan-detail"]],decls:8,vars:1,consts:[[1,"d-flex","justify-content-center"],[1,"col-8"],[4,"ngIf"],["data-cy","scanDetailsHeading"],["jhiTranslate","gradeScopeIsticApp.scan.detail.title"],[1,"row-md","jh-entity-details"],["jhiTranslate","global.field.id"],["jhiTranslate","gradeScopeIsticApp.scan.name"],["jhiTranslate","gradeScopeIsticApp.scan.content"],["type","submit","data-cy","entityDetailsBackButton",1,"btn","btn-info",3,"click"],["icon","arrow-left"],["jhiTranslate","entity.action.back"],["type","button",1,"btn","btn-primary",3,"routerLink"],["icon","pencil-alt"],["jhiTranslate","entity.action.edit"],["jhiTranslate","entity.action.open",3,"click"]],template:function(t,a){1&t&&(n.TgZ(0,"div",0),n._uU(1,"\n  "),n.TgZ(2,"div",1),n._uU(3,"\n    "),n.YNc(4,G,60,6,"div",2),n._uU(5,"\n  "),n.qZA(),n._uU(6,"\n"),n.qZA(),n._uU(7,"\n")),2&t&&(n.xp6(4),n.Q6J("ngIf",a.scan))},directives:[_.O5,m.P,U.A,y.w,Z.BN,u.rH],encapsulation:2}),e})();var W=s(28746),b=s(20104),A=s(78821);function nn(e,o){1&e&&(n.TgZ(0,"small",23),n._uU(1,"\n              This field is required.\n            "),n.qZA())}function tn(e,o){if(1&e&&(n.TgZ(0,"div"),n._uU(1,"\n            "),n.YNc(2,nn,2,0,"small",22),n._uU(3,"\n          "),n.qZA()),2&e){const t=n.oxw();let a;n.xp6(2),n.Q6J("ngIf",null==(a=t.editForm.get("name"))||null==a.errors?null:a.errors.required)}}function en(e,o){if(1&e){const t=n.EpF();n.TgZ(0,"div",24),n._uU(1,"\n              "),n.TgZ(2,"a",25),n.NdJ("click",function(){n.CHM(t);const i=n.oxw();return i.openFile(i.editForm.get("content").value,i.editForm.get("contentContentType").value)}),n._uU(3,"open"),n.qZA(),n._UZ(4,"br"),n._uU(5,"\n              "),n.TgZ(6,"span",26),n._uU(7),n.qZA(),n._uU(8,"\n              "),n.TgZ(9,"button",27),n.NdJ("click",function(){n.CHM(t);const i=n.oxw();return i.editForm.patchValue({content:null}),i.editForm.patchValue({contentContentType:null})}),n._uU(10,"\n                "),n._UZ(11,"fa-icon",28),n._uU(12,"\n              "),n.qZA(),n._uU(13,"\n            "),n.qZA()}if(2&e){const t=n.oxw();n.xp6(7),n.AsE("",t.editForm.get("contentContentType").value,", ",t.byteSize(t.editForm.get("content").value),"")}}let C=(()=>{class e{constructor(t,a,i,c,l){this.dataUtils=t,this.eventManager=a,this.scanService=i,this.activatedRoute=c,this.fb=l,this.isSaving=!1,this.editForm=this.fb.group({id:[],name:[null,[r.kI.required]],content:[],contentContentType:[]})}ngOnInit(){this.activatedRoute.data.subscribe(({scan:t})=>{this.updateForm(t)})}byteSize(t){return this.dataUtils.byteSize(t)}openFile(t,a){this.dataUtils.openFile(t,a)}setFileData(t,a,i){this.dataUtils.loadFileToForm(t,this.editForm,a,i).subscribe({error:c=>this.eventManager.broadcast(new A.R("gradeScopeIsticApp.error",Object.assign(Object.assign({},c),{key:"error.file."+c.key})))})}previousState(){window.history.back()}save(){this.isSaving=!0;const t=this.createFromForm();this.subscribeToSaveResponse(void 0!==t.id?this.scanService.update(t):this.scanService.create(t))}subscribeToSaveResponse(t){t.pipe((0,W.x)(()=>this.onSaveFinalize())).subscribe({next:()=>this.onSaveSuccess(),error:()=>this.onSaveError()})}onSaveSuccess(){this.previousState()}onSaveError(){}onSaveFinalize(){this.isSaving=!1}updateForm(t){this.editForm.patchValue({id:t.id,name:t.name,content:t.content,contentContentType:t.contentContentType})}createFromForm(){return Object.assign(Object.assign({},new b.h),{id:this.editForm.get(["id"]).value,name:this.editForm.get(["name"]).value,contentContentType:this.editForm.get(["contentContentType"]).value,content:this.editForm.get(["content"]).value})}}return e.\u0275fac=function(t){return new(t||e)(n.Y36(f.A),n.Y36(A.Q),n.Y36(g.I),n.Y36(u.gz),n.Y36(r.qu))},e.\u0275cmp=n.Xpm({type:e,selectors:[["jhi-scan-update"]],decls:71,vars:6,consts:[[1,"d-flex","justify-content-center"],[1,"col-8"],["name","editForm","role","form","novalidate","",3,"formGroup","ngSubmit"],["id","jhi-scan-heading","data-cy","ScanCreateUpdateHeading","jhiTranslate","gradeScopeIsticApp.scan.home.createOrEditLabel"],[1,"row","mb-3",3,"hidden"],["jhiTranslate","global.field.id","for","field_id",1,"form-label"],["type","number","name","id","id","field_id","data-cy","id","formControlName","id",1,"form-control",3,"readonly"],[1,"row","mb-3"],["jhiTranslate","gradeScopeIsticApp.scan.name","for","field_name",1,"form-label"],["type","text","name","name","id","field_name","data-cy","name","formControlName","name",1,"form-control"],[4,"ngIf"],["jhiTranslate","gradeScopeIsticApp.scan.content","for","field_content",1,"form-label"],["class","form-text text-danger clearfix",4,"ngIf"],["type","file","id","file_content","data-cy","content","jhiTranslate","entity.action.addblob",3,"change"],["type","hidden","name","content","id","field_content","data-cy","content","formControlName","content",1,"form-control"],["type","hidden","name","contentContentType","id","field_contentContentType","formControlName","contentContentType",1,"form-control"],["type","button","id","cancel-save","data-cy","entityCreateCancelButton",1,"btn","btn-secondary",3,"click"],["icon","ban"],["jhiTranslate","entity.action.cancel"],["type","submit","id","save-entity","data-cy","entityCreateSaveButton",1,"btn","btn-primary",3,"disabled"],["icon","save"],["jhiTranslate","entity.action.save"],["class","form-text text-danger","jhiTranslate","entity.validation.required",4,"ngIf"],["jhiTranslate","entity.validation.required",1,"form-text","text-danger"],[1,"form-text","text-danger","clearfix"],["jhiTranslate","entity.action.open",1,"pull-start",3,"click"],[1,"pull-start"],["type","button",1,"btn","btn-secondary","btn-xs","pull-end",3,"click"],["icon","times"]],template:function(t,a){1&t&&(n.TgZ(0,"div",0),n._uU(1,"\n  "),n.TgZ(2,"div",1),n._uU(3,"\n    "),n.TgZ(4,"form",2),n.NdJ("ngSubmit",function(){return a.save()}),n._uU(5,"\n      "),n.TgZ(6,"h2",3),n._uU(7,"\n        Create or edit a Scan\n      "),n.qZA(),n._uU(8,"\n\n      "),n.TgZ(9,"div"),n._uU(10,"\n        "),n._UZ(11,"jhi-alert-error"),n._uU(12,"\n\n        "),n.TgZ(13,"div",4),n._uU(14,"\n          "),n.TgZ(15,"label",5),n._uU(16,"ID"),n.qZA(),n._uU(17,"\n          "),n._UZ(18,"input",6),n._uU(19,"\n        "),n.qZA(),n._uU(20,"\n\n        "),n.TgZ(21,"div",7),n._uU(22,"\n          "),n.TgZ(23,"label",8),n._uU(24,"Name"),n.qZA(),n._uU(25,"\n          "),n._UZ(26,"input",9),n._uU(27,"\n          "),n.YNc(28,tn,4,1,"div",10),n._uU(29,"\n        "),n.qZA(),n._uU(30,"\n\n        "),n.TgZ(31,"div",7),n._uU(32,"\n          "),n.TgZ(33,"label",11),n._uU(34,"Content"),n.qZA(),n._uU(35,"\n          "),n.TgZ(36,"div"),n._uU(37,"\n            "),n.YNc(38,en,14,2,"div",12),n._uU(39,"\n            "),n.TgZ(40,"input",13),n.NdJ("change",function(c){return a.setFileData(c,"content",!1)}),n.qZA(),n._uU(41,"\n          "),n.qZA(),n._uU(42,"\n          "),n._UZ(43,"input",14),n._uU(44,"\n          "),n._UZ(45,"input",15),n._uU(46,"\n        "),n.qZA(),n._uU(47,"\n      "),n.qZA(),n._uU(48,"\n\n      "),n.TgZ(49,"div"),n._uU(50,"\n        "),n.TgZ(51,"button",16),n.NdJ("click",function(){return a.previousState()}),n._uU(52,"\n          "),n._UZ(53,"fa-icon",17),n._uU(54,"\xa0"),n.TgZ(55,"span",18),n._uU(56,"Cancel"),n.qZA(),n._uU(57,"\n        "),n.qZA(),n._uU(58,"\n\n        "),n.TgZ(59,"button",19),n._uU(60,"\n          "),n._UZ(61,"fa-icon",20),n._uU(62,"\xa0"),n.TgZ(63,"span",21),n._uU(64,"Save"),n.qZA(),n._uU(65,"\n        "),n.qZA(),n._uU(66,"\n      "),n.qZA(),n._uU(67,"\n    "),n.qZA(),n._uU(68,"\n  "),n.qZA(),n._uU(69,"\n"),n.qZA(),n._uU(70,"\n")),2&t&&(n.xp6(4),n.Q6J("formGroup",a.editForm),n.xp6(9),n.Q6J("hidden",null==a.editForm.get("id").value),n.xp6(5),n.Q6J("readonly",!0),n.xp6(10),n.Q6J("ngIf",a.editForm.get("name").invalid&&(a.editForm.get("name").dirty||a.editForm.get("name").touched)),n.xp6(10),n.Q6J("ngIf",a.editForm.get("content").value),n.xp6(21),n.Q6J("disabled",a.editForm.invalid||a.isSaving))},directives:[r._Y,r.JL,r.sg,m.P,U.A,r.wV,r.Fj,r.JJ,r.u,_.O5,Z.BN],encapsulation:2}),e})();var x=s(39646),an=s(60515),on=s(95577);let v=(()=>{class e{constructor(t,a){this.service=t,this.router=a}resolve(t){const a=t.params.id;return a?this.service.find(a).pipe((0,on.z)(i=>i.body?(0,x.of)(i.body):(this.router.navigate(["404"]),an.E))):(0,x.of)(new b.h)}}return e.\u0275fac=function(t){return new(t||e)(n.LFG(g.I),n.LFG(u.F0))},e.\u0275prov=n.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"}),e})();const cn=[{path:"",component:V,data:{defaultSort:"id,asc"},canActivate:[p.Z]},{path:":id/view",component:$,resolve:{scan:v},canActivate:[p.Z]},{path:"new",component:C,resolve:{scan:v},canActivate:[p.Z]},{path:":id/edit",component:C,resolve:{scan:v},canActivate:[p.Z]}];let sn=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=n.oAB({type:e}),e.\u0275inj=n.cJS({imports:[[u.Bz.forChild(cn)],u.Bz]}),e})(),rn=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=n.oAB({type:e}),e.\u0275inj=n.cJS({imports:[[I.m,sn]]}),e})()}}]);