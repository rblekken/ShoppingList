"use strict";var gulp=require("gulp"),paths=gulp.paths,$=require("gulp-load-plugins")();gulp.task("styles",function(){var e=({paths:["bower_components",paths.src+"/app",paths.src+"/components"]},gulp.src([paths.src+"/{app,components}/**/*.less","!"+paths.src+"/app/index.less","!"+paths.src+"/app/vendor.less"],{read:!1})),o={transform:function(e){return e=e.replace(paths.src+"/app/",""),e=e.replace(paths.src+"/components/","../components/"),"@import '"+e+"';"},starttag:"// injector",endtag:"// endinjector",addRootSlash:!1},r=$.filter("index.less");return gulp.src([paths.src+"/app/index.less",paths.src+"/app/vendor.less"]).pipe(r).pipe($.inject(e,o)).pipe(r.restore()).pipe($.less()).pipe($.autoprefixer()).on("error",function(e){console.error(e.toString()),this.emit("end")}).pipe(gulp.dest(paths.tmp+"/serve/app/"))}),angular.module("app.login",[]).factory("authenticationService",["$base64","$http","$cookieStore","$rootScope","$timeout","loggedInUserFactory",function(e,o,r,n,t,a){var s={};return s.Login=function(e,t,s){o.post("/webapi/api/user/login",{username:e,password:t}).success(function(e){s(e),n.globals.currentUser.id=e.UserId,r.put("globals",n.globals),a.refresh()}).error(function(e){s(e)})},s.SetCredentials=function(t,a){var s=e.encode(t+":"+a);n.globals={currentUser:{username:t,authdata:s}},o.defaults.headers.common.Authorization="Basic "+s,r.put("globals",n.globals)},s.ClearCredentials=function(){n.globals={},r.remove("globals"),o.defaults.headers.common.Authorization="Basic "},s}]),angular.module("app.login").controller("LoginController",["$scope","$rootScope","$location","authenticationService","loggedInUserFactory",function(e,o,r,n){n.ClearCredentials(),e.login=function(){e.dataLoading=!0,n.Login(e.username,e.password,function(o){o.Success?(n.SetCredentials(e.username,e.password),r.path("/index/main")):(e.error=o.Message,e.dataLoading=!1)})}}]),angular.module("app.login").factory("loggedInUserFactory",["$rootScope",function(e){var o=this;return o.refresh=function(){void 0!==e.globals&&void 0!==e.globals.currentUser&&(o.id=e.globals.currentUser.id)},o.refresh(),o}]),angular.module("app",["ui.router","app.login","base64","ngCookies"]).config(["$stateProvider","$urlRouterProvider",function(e,o){e.state("login",{url:"/login",templateUrl:"app/login/login.html",data:{pageTitle:"Login"}}).state("signUp",{url:"/signUp",templateUrl:"app/signUp/signUp.html"}).state("index.main",{url:"/main",templateUrl:"app/main/main.html"}),o.otherwise("/login")}]),angular.module("app").run(["$templateCache",function(e){e.put("app/main/main.html","<div>Sup world!?</div>"),e.put("app/signUp/signUp.html","<div><h1>SignUp</h1></div>"),e.put("app/login/login.html",'<div class="container" ng-app="app.login" ng-controller="LoginController"><div><form name="form" class="m-t" role="form" ng-submit="login()"><h2 class="form-signin-heading">Please sign in</h2><input type="text" ng-model="username" class="form-control" placeholder="Username" required="" autofocus=""> <input type="password" ng-model="password" class="form-control" placeholder="Password" required=""><div class="checkbox"><label><input type="checkbox" value="remember-me"> Remember me</label></div><button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button></form></div></div>')}]);