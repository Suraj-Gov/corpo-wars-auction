// THIS IS A HUGE FILE, I DID NOT REFACTOR IT INTO COMPONENTS.
// If you're seeing this, I'm sorry for the huge file.
import React, { Component } from "react";
import ReactDOM from "react-dom";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import config from "./firestore";
import "./styles/main.css";

class Main extends Component {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    super();
    this.state = {
      companies: [],
      changes: [],
      currentUser: "",
      funds: -1,
      userUpdates: [],
      canBid: false,
    };
    this.db = firebase.firestore();
    this.auth = firebase.auth();
    this.provider = new firebase.auth.GoogleAuthProvider();
    this.auth.onAuthStateChanged(async (user) => {
      if (user !== null) {
        try {
          const userDetails = await this.db
            .collection("users")
            .doc(user.email)
            .get();
          this.setState({
            currentUser: user.email,
            funds: userDetails.data().fundsRemaining,
            canBid: userDetails.data().canBid,
          });
        } catch (e) {
          console.log(
            "some error happened when fetching existing user data",
            e
          );
        }
      }
    });
  }

  generateRandColor = () => {
    let hue = Math.random();
    hue %= 1;
    return `hsl(${hue * 360}, 40%, 70%)`;
  };

  componentDidMount() {
    this.db.collection("companies").onSnapshot((snapshot) => {
      let dataChange = snapshot.docChanges();
      if (dataChange.every((i) => i.type === "added")) {
        this.setState({
          companies: dataChange.map((i) => {
            return {
              id: i.doc.id,
              ...i.doc.data(),
              color: this.generateRandColor(),
            };
          }),
        });
      } else
        this.setState({
          changes: dataChange,
        });
    });
    this.db.collection("users").onSnapshot((snapshot) => {
      let dataChange = snapshot.docChanges();
      if (dataChange.every((i) => i.type === "modified")) {
        this.setState({
          userUpdates: dataChange,
        });
      }
    });
  }

  componentDidUpdate() {
    if (this.state.changes.length !== 0) {
      if (!this.state.currentUser) {
        alert("Log in for real time updates");
        return;
      }
      let updatedCompanies = this.state.companies;
      this.state.changes.forEach((change) => {
        updatedCompanies = updatedCompanies.map((i) => {
          if (i.id === change.doc.id) {
            if (
              i.biddingParty === this.state.currentUser ||
              change.doc.data().biddingParty === this.state.currentUser
            ) {
              this.db
                .collection("users")
                .doc(this.state.currentUser)
                .update({
                  fundsRemaining: 3000 - 900 - (i.bids + 1) * 25,
                });
              this.setState({
                funds: 3000 - 900 - (i.bids + 1) * 25,
              });
            }
            if (change.doc.data().biddingParty !== this.state.currentUser) {
              this.db.collection("users").doc(this.state.currentUser).update({
                fundsRemaining: 3000,
              });
              this.setState({
                funds: 3000,
              });
            }
            return {
              ...change.doc.data(),
              id: change.doc.id,
              color: i.color,
            };
          } else return i;
        });
      });
      this.setState({
        companies: updatedCompanies,
        changes: [],
      });
    }
    if (this.state.userUpdates.length !== 0) {
      if (
        this.state.userUpdates[0].doc.data().name === this.state.currentUser
      ) {
        this.setState({
          canBid: this.state.userUpdates[0].doc.data().canBid,
          userUpdates: [],
        });
      }
    }
  }

  bidCompany = (id, bids) => {
    if (this.state.funds > 0) {
      this.db
        .collection("companies")
        .doc(id)
        .update({
          bids: bids + 1,
          biddingParty: this.state.currentUser,
        });
    } else console.log("NO FUNDS REMAINING!");
  };

  setAmount = (bids) => {
    const initAmount = 900;
    const calculatedAmount = bids * 25;
    const result = (initAmount + calculatedAmount).toString();
    return this.formatAmount(result);
  };

  formatAmount = (amount) => {
    if (amount === 0) {
      return "₹0";
    }
    amount = amount.toString();
    return `₹${amount.slice(0, -2)}${
      amount.slice(-2) === "00" ? "" : "." + amount.slice(-2)
    } Crores`;
  };

  resetStats = async () => {
    const companiesToReset = await this.db.collection("companies").get();
    companiesToReset.forEach((doc) => {
      doc.ref.update({
        bids: 0,
        biddingParty: "",
      });
    });
  };

  loginUser = async (e) => {
    console.log("logged in user");
    e.preventDefault();
    const email = document.getElementById("email").value.toLowerCase();
    const password = document.getElementById("pass").value;
    this.auth
      .signInWithEmailAndPassword(email, password)
      .then(async (res) => {
        try {
          const userDetails = await this.db
            .collection("users")
            .doc(email)
            .get();
          this.setState({
            funds: userDetails.data().fundsRemaining,
          });
        } catch (e) {
          console.log(
            "some error happened when fetching existing user data",
            e
          );
        }

        this.setState({
          currentUser: res.user.email,
        });
      })
      .catch((err) => {
        alert(err.message);
        return;
      });
  };

  createUser = async (e) => {
    console.log("created user");
    e.preventDefault();
    const email = document.getElementById("email").value.toLowerCase();
    const password = document.getElementById("pass").value;

    this.db.collection("users").doc(email).set({
      name: email,
      fundsRemaining: 3000,
    });

    this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (res) => {
        try {
          const userDetails = await this.db
            .collection("users")
            .doc(email)
            .get();
          this.setState({
            funds: userDetails.data().fundsRemaining,
          });
        } catch (e) {
          console.log(
            "some error happened when fetching existing user data",
            e
          );
        }

        this.setState({
          currentUser: res.user.email,
        });
      });
  };

  toggleClickableCompany = async (id) => {
    const companyToToggle = await this.db.collection("companies").doc(id).get();
    const companyBiddableStatus = companyToToggle.data().isBiddable;
    this.db.collection("companies").doc(id).update({
      isBiddable: !companyBiddableStatus,
    });
  };

  render() {
    return (
      <div className="container">
        <div className="head">
          <div className="title">
            <h1>Corporate Wars</h1>
            <h4>Auction</h4>
          </div>
          {this.state.companies.length !== 0 ? (
            this.state.currentUser &&
            this.state.currentUser !== "spectator@cw.com" ? (
              // If the user is logged in and the user is not a spectator
              this.state.currentUser === "dev@cw.com" ? (
                <div className="reset">
                  <button
                    hidden={this.state.currentUser !== "dev@cw.com"}
                    onClick={() => this.resetStats()}
                  >
                    <strong>RESET</strong>
                  </button>
                </div>
              ) : (
                <div className="balance">
                  {/* show money bag svg here */}
                  <svg
                    width="40%"
                    height="100%"
                    viewBox="0 0 126 86"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M125.758 54.8578C123.768 40.929 118.727 23.2857 106.788 15.5917L111.564 10.816C113.421 9.09151 113.952 6.43839 113.023 4.05058C112.094 1.79542 109.839 0.203552 107.319 0.203552H79.8589C77.3385 0.203552 75.0833 1.66277 74.1547 4.05058C73.2261 6.43839 73.7568 9.09151 75.6139 10.816L80.3896 15.5917C74.5527 19.4387 70.4404 25.6735 67.3893 32.5716C63.6749 30.7144 58.3687 29.7858 53.0624 29.7858C43.6438 29.7858 33.9599 32.8369 33.9599 38.6738V51.6741C30.2456 49.5516 24.674 48.4904 19.1025 48.4904C9.68389 48.4904 0 51.5414 0 57.3783V76.2155C0 82.0523 9.55124 85.1034 19.1025 85.1034C25.8679 85.1034 32.766 83.5115 36.0824 80.4605C39.3988 83.5115 46.297 85.1034 53.0624 85.1034C62.481 85.1034 72.1649 82.0523 72.1649 76.2155V74.3583C73.7568 75.0216 75.3486 75.5522 77.2058 75.8175C82.3794 76.6134 87.951 76.8787 93.7878 76.8787C99.492 76.8787 105.064 76.4808 110.37 75.8175C115.278 75.1542 119.656 72.5011 122.574 68.5214C125.36 64.5417 126.554 59.7661 125.758 54.8578ZM78.3997 7.76495C77.4711 6.96901 77.8691 5.90776 78.0018 5.64245C78.1344 5.37714 78.5324 4.44855 79.8589 4.44855H107.451C108.645 4.44855 109.176 5.37714 109.309 5.64245C109.441 5.90776 109.707 6.96901 108.911 7.76495L102.41 14.1324C96.8389 15.9896 90.7367 15.9896 85.1652 14.1324L78.3997 7.76495ZM38.0723 63.2152C41.7867 65.3377 47.3582 66.3989 52.9298 66.3989C58.5013 66.3989 64.0729 65.3377 67.7872 63.2152V66.7969C67.7872 68.3888 62.083 71.4398 52.9298 71.4398C43.7765 71.4398 38.0723 68.3888 38.0723 66.7969V63.2152ZM52.9298 62.0213C43.7765 62.0213 38.0723 58.9702 38.0723 57.3783V53.7966C41.7867 55.9191 47.3582 56.9803 52.9298 56.9803C58.5013 56.9803 64.0729 55.9191 67.7872 53.7966V57.3783C67.7872 59.1028 62.2157 62.0213 52.9298 62.0213ZM52.9298 33.8982C62.083 33.8982 67.7872 36.9493 67.7872 38.5411C67.7872 40.133 62.083 43.1841 52.9298 43.1841C43.7765 43.1841 38.0723 40.133 38.0723 38.5411C38.0723 36.9493 43.7765 33.8982 52.9298 33.8982ZM38.0723 44.378C41.7867 46.5005 47.3582 47.5618 52.9298 47.5618C58.5013 47.5618 64.0729 46.5005 67.7872 44.378V47.9597C67.7872 49.5516 62.083 52.6027 52.9298 52.6027C43.7765 52.6027 38.0723 49.6843 38.0723 47.9597V44.378ZM19.1025 52.7353C28.2557 52.7353 33.9599 55.7864 33.9599 57.3783C33.9599 58.9702 28.2557 62.0213 19.1025 62.0213C9.9492 62.0213 4.24499 59.1028 4.24499 57.3783C4.24499 55.7864 9.81655 52.7353 19.1025 52.7353ZM4.24499 63.2152C7.95936 65.3377 13.5309 66.3989 19.1025 66.3989C24.674 66.3989 30.2456 65.3377 33.9599 63.2152V66.7969C33.9599 68.3888 28.2557 71.4398 19.1025 71.4398C9.9492 71.4398 4.24499 68.3888 4.24499 66.7969V63.2152ZM19.1025 80.8584C9.9492 80.8584 4.24499 77.8073 4.24499 76.2155V72.6337C7.95936 74.7562 13.5309 75.8175 19.1025 75.8175C24.674 75.8175 30.2456 74.7562 33.9599 72.6337V76.2155C33.9599 77.8073 28.2557 80.8584 19.1025 80.8584ZM52.9298 80.8584C43.7765 80.8584 38.0723 77.8073 38.0723 76.2155V72.6337C41.7867 74.7562 47.3582 75.8175 52.9298 75.8175C58.5013 75.8175 64.0729 74.7562 67.7872 72.6337V76.2155C67.7872 77.8073 62.2157 80.8584 52.9298 80.8584ZM118.992 66.0009C116.737 69.052 113.288 71.0419 109.441 71.5725C99.3594 73.0317 87.6856 73.0317 77.6038 71.5725C75.6139 71.3072 73.6241 70.5112 72.0322 69.45V38.5411C72.0322 37.3472 71.6343 36.1533 70.8383 35.2247C73.7568 28.0613 78.0018 21.5612 84.1039 18.2448C87.155 19.306 90.3388 19.8366 93.6552 19.8366C96.8389 19.8366 100.155 19.306 103.206 18.2448C115.411 24.8776 120.054 44.2454 121.778 55.3885C122.176 59.2355 121.248 62.9499 118.992 66.0009Z"
                      fill="black"
                    />
                    <path
                      d="M101.084 34.4288H86.0936C85.8283 34.4288 85.563 34.6941 85.563 34.9594V37.4799C85.563 37.7452 85.8283 38.0105 86.0936 38.0105H90.6039C92.1958 38.0105 93.655 38.9391 94.3183 40.3983H86.0936C85.8283 40.3983 85.563 40.6636 85.563 40.9289V43.3167C85.563 43.582 85.8283 43.8474 86.0936 43.8474H94.3183C93.655 45.3066 92.1958 46.2352 90.6039 46.2352H86.0936C85.8283 46.2352 85.563 46.5005 85.563 46.7658V50.6128C85.563 50.7455 85.563 50.8781 85.6956 51.0108L93.3897 58.8375C93.5224 58.9701 93.655 58.9701 93.7877 58.9701H97.3694C97.6347 58.9701 97.7674 58.8375 97.9 58.5722C98.0327 58.3069 97.9 58.0415 97.7673 57.9089L90.0733 50.0822H90.6039C94.1856 50.0822 97.502 47.5617 98.298 43.98H101.084C101.349 43.98 101.614 43.7147 101.614 43.4494V41.0616C101.614 40.7963 101.349 40.5309 101.084 40.5309H98.298C98.0327 39.6024 97.6347 38.6738 97.1041 37.8778H100.951C101.216 37.8778 101.482 37.6125 101.482 37.3472V34.9594C101.614 34.6941 101.349 34.4288 101.084 34.4288Z"
                      fill="black"
                    />
                  </svg>

                  <div>
                    <h5>Balance</h5>
                    <h3>{this.formatAmount(this.state.funds)}</h3>
                    <button
                      hidden={!this.state.currentUser}
                      onClick={() => {
                        this.auth.signOut();
                        this.setState({
                          currentUser: "",
                          funds: -1,
                        });
                      }}
                    >
                      SIGN OUT
                    </button>
                  </div>
                </div>
              )
            ) : (
              // If the user is not logged
              <div
                className="login"
                style={{
                  display:
                    this.state.currentUser === "spectator@cw.com"
                      ? "none"
                      : "flex",
                }}
              >
                {/* show login and password svgs here */}
                <input
                  placeholder="EMAIL"
                  type="email"
                  id="email"
                  name="email"
                />

                <input
                  placeholder="PASSWORD"
                  type="password"
                  id="pass"
                  name="password"
                  minLength="8"
                  required
                />
                <button
                  onClick={(e) => {
                    this.loginUser(e);
                  }}
                >
                  LOGIN
                </button>
              </div>
            )
          ) : (
            <div>
              <h1>LOADING...</h1>
            </div>
          )}
        </div>
        {this.state.companies.length === 0 ? (
          <div className="loading">
            <h1>LOADING...</h1>
          </div>
        ) : (
          <ul>
            {this.state.companies.map((company) => (
              <li
                key={company["id"]}
                style={{ backgroundColor: company["color"] }}
              >
                <h2>{company["companyName"]}</h2>
                <div className="details">
                  <div className="value">
                    <h6>VALUE</h6>
                    <h3>{this.setAmount(company["bids"])}</h3>
                  </div>
                  <div className="bidder">
                    <h6>HIGHEST BIDDER</h6>
                    <h3>
                      {!company["biddingParty"]
                        ? "No bids yet"
                        : company["biddingParty"]}
                    </h3>
                  </div>
                </div>
                <div className="action">
                  {(this.state.currentUser.length !== 0) &
                  (this.state.currentUser !== "spectator@cw.com") ? (
                    this.state.currentUser === "dev@cw.com" ? (
                      <button
                        style={{
                          backgroundColor: company["isBiddable"]
                            ? "#5C0000"
                            : "#020069",
                        }}
                        onClick={() =>
                          this.toggleClickableCompany(company["id"])
                        }
                      >
                        {company["isBiddable"] ? "TURN OFF" : "TURN ON"}
                      </button>
                    ) : (
                      <button
                        disabled={!company["isBiddable"] || !this.state.canBid}
                        onClick={() =>
                          this.bidCompany(company["id"], company["bids"])
                        }
                      >
                        BID
                      </button>
                    )
                  ) : (
                    <div className="status">
                      <p>
                        {company["isBiddable"]
                          ? "BIDS ACTIVE"
                          : "BIDS DISABLED"}
                      </p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        {/* <button
          hidden={this.state.currentUser}
          onClick={(e) => this.createUser(e)}
        >
          CREATE ACCOUNT ONLY DEV MODE
        </button> */}
        {/* <strong>{company["companyName"]}</strong>
        {/* <span>{"    "}</span> */}
        {/* <em>{this.setAmount(company["bids"])}</em>
              <span>{"    "}</span>
              <span>
                {company["biddingParty"].length === 0
                  ? "No bids yet"
                  : company["biddingParty"]}
              </span> */}
        {/* <button
                onClick={() => this.bidCompany(company["id"], company["bids"])}
                hidden={
                  !company["isBiddable"] ||
                  this.state.currentUser === "spectator@cw.com" ||
                  this.state.currentUser === "dev@cw.com"
                }
              >
                Bid
              </button> */}
        {/* <button
                hidden={!(this.state.currentUser === "dev@cw.com")}
                onClick={() => this.toggleClickableCompany(company["id"])}
              >
                Toggle
              </button> */}
        {/* <div>
          <button
            hidden={this.state.currentUser}
            onClick={(e) => {
              this.loginUser(e);
            }}
          >
            Sign in
          </button>
          <button
            hidden={!this.state.currentUser}
            onClick={() => {
              this.auth.signOut();
              this.setState({
                currentUser: "",
                funds: -1,
              });
            }}
          >
            SIGN OUT
          </button>
          <div>
            <button
              hidden={this.state.currentUser !== "dev@cw.com"}
              onClick={() => this.resetStats()}
            >
              <strong>RESET</strong>
            </button>
          </div>
          <div>
            <p
              hidden={
                this.state.currentUser === "dev@cw.com" ||
                this.state.currentUser === "spectator@cw.com"
              }
            >
              {this.state.currentUser
                ? `${this.state.currentUser}'s balance: ${this.formatAmount(
                    this.state.funds
                  )}`
                : "Login to bid"}
            </p>
          </div>
        </div>
         */}
        <div style={{ paddingBottom: "5em" }}></div>
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById("root"));
