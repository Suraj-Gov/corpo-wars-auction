(this["webpackJsonpcorpo-wars-auction"]=this["webpackJsonpcorpo-wars-auction"]||[]).push([[0],{17:function(e,t,a){e.exports=a(30)},29:function(e,t,a){},30:function(e,t,a){"use strict";a.r(t);var n=a(5),r=a(1),c=a.n(r),s=a(2),i=a(12),o=a(13),u=a(16),l=a(15),d=a(0),m=a.n(d),p=a(14),C=a.n(p),h=a(3),f=a.n(h),g=(a(23),a(25),{apiKey:"AIzaSyCsj1M_Qk5IWqvyC38uQE8TP3D5seHjzVo",authDomain:"corpo-wars-auction.firebaseapp.com",databaseURL:"https://corpo-wars-auction.firebaseio.com",projectId:"corpo-wars-auction",storageBucket:"corpo-wars-auction.appspot.com",messagingSenderId:"862277153293",appId:"1:862277153293:web:1b47d264921306a9fe1b44",measurementId:"G-GTS4JQF5KZ"}),b=(a(29),function(e){Object(u.a)(a,e);var t=Object(l.a)(a);function a(){var e;return Object(i.a)(this,a),f.a.apps.length||f.a.initializeApp(g),(e=t.call(this)).bidCompany=function(t,a){e.state.funds>0?e.db.collection("companies").doc(t).update({bids:a+1,biddingParty:e.state.currentUser}):console.log("NO FUNDS REMAINING!")},e.setAmount=function(t){var a=(900+25*t).toString();return e.formatAmount(a)},e.formatAmount=function(e){return 0===e?"\u20b90":(e=e.toString(),"\u20b9".concat(e.slice(0,-2)).concat("00"===e.slice(-2)?"":"."+e.slice(-2)," Crores"))},e.resetStats=Object(s.a)(c.a.mark((function t(){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.db.collection("companies").get();case 2:t.sent.forEach((function(e){e.ref.update({bids:0,biddingParty:""})}));case 4:case"end":return t.stop()}}),t)}))),e.loginUser=function(){var t=Object(s.a)(c.a.mark((function t(a){var n,r;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:console.log("logged in user"),a.preventDefault(),n=document.getElementById("email").value.toLowerCase(),r=document.getElementById("pass").value,e.auth.signInWithEmailAndPassword(n,r).then(function(){var t=Object(s.a)(c.a.mark((function t(a){var r;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.db.collection("users").doc(n).get();case 3:r=t.sent,e.setState({funds:r.data().fundsRemaining}),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0),console.log("some error happened when fetching existing user data",t.t0);case 10:e.setState({currentUser:a.user.email});case 11:case"end":return t.stop()}}),t,null,[[0,7]])})));return function(e){return t.apply(this,arguments)}}()).catch((function(e){console.log("Error occured, user might not be in registry.",e)}));case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),e.createUser=function(){var t=Object(s.a)(c.a.mark((function t(a){var n,r;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:console.log("created user"),a.preventDefault(),n=document.getElementById("email").value.toLowerCase(),r=document.getElementById("pass").value,e.db.collection("users").doc(n).set({name:n,fundsRemaining:3e3}),e.auth.createUserWithEmailAndPassword(n,r).then(function(){var t=Object(s.a)(c.a.mark((function t(a){var r;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.db.collection("users").doc(n).get();case 3:r=t.sent,e.setState({funds:r.data().fundsRemaining}),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0),console.log("some error happened when fetching existing user data",t.t0);case 10:e.setState({currentUser:a.user.email});case 11:case"end":return t.stop()}}),t,null,[[0,7]])})));return function(e){return t.apply(this,arguments)}}());case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),e.toggleClickableCompany=function(){var t=Object(s.a)(c.a.mark((function t(a){var n,r;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.db.collection("companies").doc(a).get();case 2:n=t.sent,r=n.data().isBiddable,e.db.collection("companies").doc(a).update({isBiddable:!r});case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),e.state={companies:[],changes:[],currentUser:"",funds:-1},e.db=f.a.firestore(),e.auth=f.a.auth(),e.provider=new f.a.auth.GoogleAuthProvider,e.auth.onAuthStateChanged(function(){var t=Object(s.a)(c.a.mark((function t(a){var n;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(null===a){t.next=11;break}return t.prev=1,t.next=4,e.db.collection("users").doc(a.email).get();case 4:n=t.sent,e.setState({currentUser:a.email,funds:n.data().fundsRemaining}),t.next=11;break;case 8:t.prev=8,t.t0=t.catch(1),console.log("some error happened when fetching existing user data",t.t0);case 11:case"end":return t.stop()}}),t,null,[[1,8]])})));return function(e){return t.apply(this,arguments)}}()),e}return Object(o.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.db.collection("companies").onSnapshot((function(t){var a=t.docChanges();a.every((function(e){return"added"===e.type}))?e.setState({companies:a.map((function(e){return Object(n.a)({id:e.doc.id},e.doc.data())}))}):e.setState({changes:a})}))}},{key:"componentDidUpdate",value:function(){var e=this;if(0!==this.state.changes.length){if(!this.state.currentUser)return void alert("Log in for real time updates");var t=this.state.companies;this.state.changes.forEach((function(a){t=t.map((function(t){return t.id===a.doc.id?(t.biddingParty!==e.state.currentUser&&a.doc.data().biddingParty!==e.state.currentUser||(e.db.collection("users").doc(e.state.currentUser).update({fundsRemaining:2100-25*(t.bids+1)}),e.setState({funds:2100-25*(t.bids+1)})),a.doc.data().biddingParty!==e.state.currentUser&&(e.db.collection("users").doc(e.state.currentUser).update({fundsRemaining:3e3}),e.setState({funds:3e3})),Object(n.a)(Object(n.a)({},a.doc.data()),{},{id:a.doc.id})):t}))})),this.setState({companies:t,changes:[]})}}},{key:"render",value:function(){var e=this;return m.a.createElement("div",{className:"container"},m.a.createElement("div",{className:"head"},m.a.createElement("div",{className:"title"},m.a.createElement("h1",null,"Corporate Wars"),m.a.createElement("h4",null,"Auction")),0!==this.state.companies.length?this.state.currentUser&&"spectator@cw.com"!==this.state.currentUser?"dev@cw.com"===this.state.currentUser?m.a.createElement("div",{className:"reset"},m.a.createElement("button",{hidden:"dev@cw.com"!==this.state.currentUser,onClick:function(){return e.resetStats()}},m.a.createElement("strong",null,"RESET"))):m.a.createElement("div",{className:"balance"},m.a.createElement("svg",{width:"40%",height:"100%",viewBox:"0 0 126 86",fill:"none",xmlns:"http://www.w3.org/2000/svg"},m.a.createElement("path",{d:"M125.758 54.8578C123.768 40.929 118.727 23.2857 106.788 15.5917L111.564 10.816C113.421 9.09151 113.952 6.43839 113.023 4.05058C112.094 1.79542 109.839 0.203552 107.319 0.203552H79.8589C77.3385 0.203552 75.0833 1.66277 74.1547 4.05058C73.2261 6.43839 73.7568 9.09151 75.6139 10.816L80.3896 15.5917C74.5527 19.4387 70.4404 25.6735 67.3893 32.5716C63.6749 30.7144 58.3687 29.7858 53.0624 29.7858C43.6438 29.7858 33.9599 32.8369 33.9599 38.6738V51.6741C30.2456 49.5516 24.674 48.4904 19.1025 48.4904C9.68389 48.4904 0 51.5414 0 57.3783V76.2155C0 82.0523 9.55124 85.1034 19.1025 85.1034C25.8679 85.1034 32.766 83.5115 36.0824 80.4605C39.3988 83.5115 46.297 85.1034 53.0624 85.1034C62.481 85.1034 72.1649 82.0523 72.1649 76.2155V74.3583C73.7568 75.0216 75.3486 75.5522 77.2058 75.8175C82.3794 76.6134 87.951 76.8787 93.7878 76.8787C99.492 76.8787 105.064 76.4808 110.37 75.8175C115.278 75.1542 119.656 72.5011 122.574 68.5214C125.36 64.5417 126.554 59.7661 125.758 54.8578ZM78.3997 7.76495C77.4711 6.96901 77.8691 5.90776 78.0018 5.64245C78.1344 5.37714 78.5324 4.44855 79.8589 4.44855H107.451C108.645 4.44855 109.176 5.37714 109.309 5.64245C109.441 5.90776 109.707 6.96901 108.911 7.76495L102.41 14.1324C96.8389 15.9896 90.7367 15.9896 85.1652 14.1324L78.3997 7.76495ZM38.0723 63.2152C41.7867 65.3377 47.3582 66.3989 52.9298 66.3989C58.5013 66.3989 64.0729 65.3377 67.7872 63.2152V66.7969C67.7872 68.3888 62.083 71.4398 52.9298 71.4398C43.7765 71.4398 38.0723 68.3888 38.0723 66.7969V63.2152ZM52.9298 62.0213C43.7765 62.0213 38.0723 58.9702 38.0723 57.3783V53.7966C41.7867 55.9191 47.3582 56.9803 52.9298 56.9803C58.5013 56.9803 64.0729 55.9191 67.7872 53.7966V57.3783C67.7872 59.1028 62.2157 62.0213 52.9298 62.0213ZM52.9298 33.8982C62.083 33.8982 67.7872 36.9493 67.7872 38.5411C67.7872 40.133 62.083 43.1841 52.9298 43.1841C43.7765 43.1841 38.0723 40.133 38.0723 38.5411C38.0723 36.9493 43.7765 33.8982 52.9298 33.8982ZM38.0723 44.378C41.7867 46.5005 47.3582 47.5618 52.9298 47.5618C58.5013 47.5618 64.0729 46.5005 67.7872 44.378V47.9597C67.7872 49.5516 62.083 52.6027 52.9298 52.6027C43.7765 52.6027 38.0723 49.6843 38.0723 47.9597V44.378ZM19.1025 52.7353C28.2557 52.7353 33.9599 55.7864 33.9599 57.3783C33.9599 58.9702 28.2557 62.0213 19.1025 62.0213C9.9492 62.0213 4.24499 59.1028 4.24499 57.3783C4.24499 55.7864 9.81655 52.7353 19.1025 52.7353ZM4.24499 63.2152C7.95936 65.3377 13.5309 66.3989 19.1025 66.3989C24.674 66.3989 30.2456 65.3377 33.9599 63.2152V66.7969C33.9599 68.3888 28.2557 71.4398 19.1025 71.4398C9.9492 71.4398 4.24499 68.3888 4.24499 66.7969V63.2152ZM19.1025 80.8584C9.9492 80.8584 4.24499 77.8073 4.24499 76.2155V72.6337C7.95936 74.7562 13.5309 75.8175 19.1025 75.8175C24.674 75.8175 30.2456 74.7562 33.9599 72.6337V76.2155C33.9599 77.8073 28.2557 80.8584 19.1025 80.8584ZM52.9298 80.8584C43.7765 80.8584 38.0723 77.8073 38.0723 76.2155V72.6337C41.7867 74.7562 47.3582 75.8175 52.9298 75.8175C58.5013 75.8175 64.0729 74.7562 67.7872 72.6337V76.2155C67.7872 77.8073 62.2157 80.8584 52.9298 80.8584ZM118.992 66.0009C116.737 69.052 113.288 71.0419 109.441 71.5725C99.3594 73.0317 87.6856 73.0317 77.6038 71.5725C75.6139 71.3072 73.6241 70.5112 72.0322 69.45V38.5411C72.0322 37.3472 71.6343 36.1533 70.8383 35.2247C73.7568 28.0613 78.0018 21.5612 84.1039 18.2448C87.155 19.306 90.3388 19.8366 93.6552 19.8366C96.8389 19.8366 100.155 19.306 103.206 18.2448C115.411 24.8776 120.054 44.2454 121.778 55.3885C122.176 59.2355 121.248 62.9499 118.992 66.0009Z",fill:"black"}),m.a.createElement("path",{d:"M101.084 34.4288H86.0936C85.8283 34.4288 85.563 34.6941 85.563 34.9594V37.4799C85.563 37.7452 85.8283 38.0105 86.0936 38.0105H90.6039C92.1958 38.0105 93.655 38.9391 94.3183 40.3983H86.0936C85.8283 40.3983 85.563 40.6636 85.563 40.9289V43.3167C85.563 43.582 85.8283 43.8474 86.0936 43.8474H94.3183C93.655 45.3066 92.1958 46.2352 90.6039 46.2352H86.0936C85.8283 46.2352 85.563 46.5005 85.563 46.7658V50.6128C85.563 50.7455 85.563 50.8781 85.6956 51.0108L93.3897 58.8375C93.5224 58.9701 93.655 58.9701 93.7877 58.9701H97.3694C97.6347 58.9701 97.7674 58.8375 97.9 58.5722C98.0327 58.3069 97.9 58.0415 97.7673 57.9089L90.0733 50.0822H90.6039C94.1856 50.0822 97.502 47.5617 98.298 43.98H101.084C101.349 43.98 101.614 43.7147 101.614 43.4494V41.0616C101.614 40.7963 101.349 40.5309 101.084 40.5309H98.298C98.0327 39.6024 97.6347 38.6738 97.1041 37.8778H100.951C101.216 37.8778 101.482 37.6125 101.482 37.3472V34.9594C101.614 34.6941 101.349 34.4288 101.084 34.4288Z",fill:"black"})),m.a.createElement("div",null,m.a.createElement("h5",null,"Balance"),m.a.createElement("h3",null,this.formatAmount(this.state.funds)),m.a.createElement("button",{hidden:!this.state.currentUser,onClick:function(){e.auth.signOut(),e.setState({currentUser:"",funds:-1})}},"SIGN OUT"))):m.a.createElement("div",{className:"login"},m.a.createElement("input",{placeholder:"EMAIL",type:"email",id:"email",name:"email"}),m.a.createElement("input",{placeholder:"PASSWORD",type:"password",id:"pass",name:"password",minLength:"8",required:!0}),m.a.createElement("button",{onClick:function(t){e.loginUser(t)}},"LOGIN")):m.a.createElement("div",null,m.a.createElement("h1",null,"LOADING..."))),0===this.state.companies.length?m.a.createElement("div",{className:"loading"},m.a.createElement("h1",null,"LOADING...")):m.a.createElement("ul",null,this.state.companies.map((function(t){return m.a.createElement("li",{key:t.id},m.a.createElement("h2",null,t.companyName),m.a.createElement("div",{className:"details"},m.a.createElement("div",{className:"value"},m.a.createElement("h6",null,"VALUE"),m.a.createElement("h3",null,e.setAmount(t.bids))),m.a.createElement("div",{className:"bidder"},m.a.createElement("h6",null,"HIGHEST BIDDER"),m.a.createElement("h3",null,t.biddingParty?t.biddingParty:"No bids yet"))),m.a.createElement("div",{className:"action"},0!==e.state.currentUser.length&"spectator@cw.com"!==e.state.currentUser?"dev@cw.com"===e.state.currentUser?m.a.createElement("button",{style:{backgroundColor:t.isBiddable?"#5C0000":"#020069"},onClick:function(){return e.toggleClickableCompany(t.id)}},t.isBiddable?"TURN OFF":"TURN ON"):m.a.createElement("button",{disabled:!t.isBiddable,onClick:function(){return e.bidCompany(t.id,t.bids)}},"BID"):m.a.createElement("div",{className:"status"},m.a.createElement("p",null,t.isBiddable?"BIDS ACTIVE":"BIDS DISABLED"))))}))),m.a.createElement("div",{style:{paddingBottom:"5em"}}))}}]),a}(d.Component));C.a.render(m.a.createElement(b,null),document.getElementById("root"))}},[[17,1,2]]]);
//# sourceMappingURL=main.4f6a0fa7.chunk.js.map