(this["webpackJsonpcorpo-wars-auction"]=this["webpackJsonpcorpo-wars-auction"]||[]).push([[0],{17:function(e,t,n){e.exports=n(29)},29:function(e,t,n){"use strict";n.r(t);var a=n(5),r=n(1),s=n.n(r),c=n(2),i=n(12),o=n(13),u=n(16),d=n(15),l=n(0),p=n.n(l),m=n(14),h=n.n(m),f=n(3),g=n.n(f),b=(n(23),n(25),{apiKey:"AIzaSyCsj1M_Qk5IWqvyC38uQE8TP3D5seHjzVo",authDomain:"corpo-wars-auction.firebaseapp.com",databaseURL:"https://corpo-wars-auction.firebaseio.com",projectId:"corpo-wars-auction",storageBucket:"corpo-wars-auction.appspot.com",messagingSenderId:"862277153293",appId:"1:862277153293:web:1b47d264921306a9fe1b44",measurementId:"G-GTS4JQF5KZ"}),v=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(){var e;return Object(i.a)(this,n),g.a.apps.length||g.a.initializeApp(b),(e=t.call(this)).bidCompany=function(t,n){e.state.funds>0?e.db.collection("companies").doc(t).update({bids:n+1,biddingParty:e.state.currentUser}):console.log("NO FUNDS REMAINING!")},e.setAmount=function(t){var n=(900+25*t).toString();return e.formatAmount(n)},e.formatAmount=function(e){return e=e.toString(),"\u20b9".concat(e.slice(0,-2)).concat("00"===e.slice(-2)?"":"."+e.slice(-2)," Crores")},e.resetStats=Object(c.a)(s.a.mark((function t(){return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.db.collection("companies").get();case 2:t.sent.forEach((function(e){e.ref.update({bids:0,biddingParty:""})}));case 4:case"end":return t.stop()}}),t)}))),e.loginUser=function(){var t=Object(c.a)(s.a.mark((function t(n){var a,r;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:console.log("logged in user"),n.preventDefault(),a=document.getElementById("email").value.toLowerCase(),r=document.getElementById("pass").value,e.auth.signInWithEmailAndPassword(a,r).then(function(){var t=Object(c.a)(s.a.mark((function t(n){var r;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.db.collection("users").doc(a).get();case 3:r=t.sent,e.setState({funds:r.data().fundsRemaining}),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0),console.log("some error happened when fetching existing user data",t.t0);case 10:e.setState({currentUser:n.user.email});case 11:case"end":return t.stop()}}),t,null,[[0,7]])})));return function(e){return t.apply(this,arguments)}}()).catch((function(e){console.log("Error occured, user might not be in registry.",e)}));case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),e.createUser=function(){var t=Object(c.a)(s.a.mark((function t(n){var a,r;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:console.log("created user"),n.preventDefault(),a=document.getElementById("email").value.toLowerCase(),r=document.getElementById("pass").value,e.db.collection("users").doc(a).set({name:a,fundsRemaining:3e3}),e.auth.createUserWithEmailAndPassword(a,r).then(function(){var t=Object(c.a)(s.a.mark((function t(n){var r;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.db.collection("users").doc(a).get();case 3:r=t.sent,e.setState({funds:r.data().fundsRemaining}),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0),console.log("some error happened when fetching existing user data",t.t0);case 10:e.setState({currentUser:n.user.email});case 11:case"end":return t.stop()}}),t,null,[[0,7]])})));return function(e){return t.apply(this,arguments)}}());case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),e.toggleClickableCompany=function(){var t=Object(c.a)(s.a.mark((function t(n){var a,r;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.db.collection("companies").doc(n).get();case 2:a=t.sent,r=a.data().isBiddable,e.db.collection("companies").doc(n).update({isBiddable:!r});case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),e.state={companies:[],changes:[],currentUser:"",funds:-1},e.db=g.a.firestore(),e.auth=g.a.auth(),e.provider=new g.a.auth.GoogleAuthProvider,e.auth.onAuthStateChanged(function(){var t=Object(c.a)(s.a.mark((function t(n){var a;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(null===n){t.next=11;break}return t.prev=1,t.next=4,e.db.collection("users").doc(n.email).get();case 4:a=t.sent,e.setState({currentUser:n.email,funds:a.data().fundsRemaining}),t.next=11;break;case 8:t.prev=8,t.t0=t.catch(1),console.log("some error happened when fetching existing user data",t.t0);case 11:case"end":return t.stop()}}),t,null,[[1,8]])})));return function(e){return t.apply(this,arguments)}}()),e}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var e=this;this.db.collection("companies").onSnapshot((function(t){var n=t.docChanges();n.every((function(e){return"added"===e.type}))?e.setState({companies:n.map((function(e){return Object(a.a)({id:e.doc.id},e.doc.data())}))}):e.setState({changes:n})}))}},{key:"componentDidUpdate",value:function(){var e=this;if(0!==this.state.changes.length){if(!this.state.currentUser)return void alert("Log in for real time updates");var t=this.state.companies;this.state.changes.forEach((function(n){t=t.map((function(t){return t.id===n.doc.id?(t.biddingParty!==e.state.currentUser&&n.doc.data().biddingParty!==e.state.currentUser||(e.db.collection("users").doc(e.state.currentUser).update({fundsRemaining:2100-25*(t.bids+1)}),e.setState({funds:2100-25*(t.bids+1)})),n.doc.data().biddingParty!==e.state.currentUser&&(e.db.collection("users").doc(e.state.currentUser).update({fundsRemaining:3e3}),e.setState({funds:3e3})),Object(a.a)(Object(a.a)({},n.doc.data()),{},{id:n.doc.id})):t}))})),this.setState({companies:t,changes:[]})}}},{key:"render",value:function(){var e=this;return p.a.createElement(p.a.Fragment,null,p.a.createElement("ul",null,this.state.companies.map((function(t){return p.a.createElement("li",{key:t.id},p.a.createElement("strong",null,t.companyName),p.a.createElement("span",null,"    "),p.a.createElement("em",null,e.setAmount(t.bids)),p.a.createElement("span",null,"    "),p.a.createElement("span",null,0===t.biddingParty.length?"No bids yet":t.biddingParty),p.a.createElement("button",{onClick:function(){return e.bidCompany(t.id,t.bids)},hidden:!t.isBiddable||"spectator@cw.com"===e.state.currentUser||"dev@cw.com"===e.state.currentUser},"Bid"),p.a.createElement("button",{hidden:!("dev@cw.com"===e.state.currentUser),onClick:function(){return e.toggleClickableCompany(t.id)}},"Toggle"))}))),p.a.createElement("div",null,p.a.createElement("button",{hidden:this.state.currentUser,onClick:function(t){e.loginUser(t)}},"Sign in"),p.a.createElement("button",{hidden:!this.state.currentUser,onClick:function(){e.auth.signOut(),e.setState({currentUser:"",funds:-1})}},"SIGN OUT"),p.a.createElement("div",null,p.a.createElement("button",{hidden:"dev@cw.com"!==this.state.currentUser,onClick:function(){return e.resetStats()}},p.a.createElement("strong",null,"RESET"))),p.a.createElement("div",null,p.a.createElement("p",{hidden:"dev@cw.com"===this.state.currentUser||"spectator@cw.com"===this.state.currentUser},this.state.currentUser?"".concat(this.state.currentUser,"'s balance: ").concat(this.formatAmount(this.state.funds)):"Login to bid"))),p.a.createElement("label",{hidden:this.state.currentUser,htmlFor:"email"},"Email"),p.a.createElement("input",{hidden:this.state.currentUser,type:"email",id:"email",name:"email"}),p.a.createElement("label",{hidden:this.state.currentUser,htmlFor:"pass"},"Password (8 characters minimum):"),p.a.createElement("input",{hidden:this.state.currentUser,type:"password",id:"pass",name:"password",minLength:"8",required:!0}),p.a.createElement("button",{hidden:this.state.currentUser,onClick:function(t){return e.createUser(t)}},"CREATE ACCOUNT"))}}]),n}(l.Component);h.a.render(p.a.createElement(v,null),document.getElementById("root"))}},[[17,1,2]]]);
//# sourceMappingURL=main.359393b3.chunk.js.map