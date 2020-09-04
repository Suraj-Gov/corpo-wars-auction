import React, { Component } from "react";
import ReactDOM from "react-dom";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import config from "./firestore";

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

  componentDidMount() {
    this.db.collection("companies").onSnapshot((snapshot) => {
      let dataChange = snapshot.docChanges();
      if (dataChange.every((i) => i.type === "added")) {
        this.setState({
          companies: dataChange.map((i) => {
            return {
              id: i.doc.id,
              ...i.doc.data(),
              biddingParty: "", //REMOVE THIS LINE IN PROD, why?
            };
          }),
        });
      } else
        this.setState({
          changes: dataChange,
        });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.changes.length !== 0) {
      let updatedCompanies = this.state.companies;
      this.state.changes.forEach((change) => {
        updatedCompanies = updatedCompanies.map((i) => {
          if (i.id === change.doc.id) {
            return {
              ...change.doc.data(),
              id: change.doc.id,
            };
          } else return i;
        });
      });
      this.setState({
        companies: updatedCompanies,
        changes: [],
      });
    }
  }

  bidCompany = (id, bids) => {
    this.db
      .collection("companies")
      .doc(id)
      .update({
        bids: bids + 1,
        biddingParty: this.state.currentUser,
      });

    this.setState({
      funds: 3000 - 900 - bids * 25,
    });

    this.db
      .collection("users")
      .doc(this.state.currentUser)
      .update({
        fundsRemaining: 3000 - 900 - bids * 25,
      });
  };

  setAmount = (bids) => {
    const initAmount = 900;
    const calculatedAmount = bids * 25;
    const result = (initAmount + calculatedAmount).toString();
    return this.formatAmount(result);
  };

  formatAmount = (amount) => {
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
    const email = document.getElementById("email").value;
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
      .catch((res) => {
        console.log("Error occured, user might not be in registry.", res);
        return;
      });
  };

  createUser = async (e) => {
    console.log("created user");
    e.preventDefault();
    const email = document.getElementById("email").value;
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

  render() {
    return (
      <React.Fragment>
        <ul>
          {this.state.companies.map((company) => (
            <li key={company["id"]}>
              <strong>{company["companyName"]}</strong>
              <span>{"    "}</span>
              <em>{this.setAmount(company["bids"])}</em>
              <span>{"    "}</span>
              <span>
                {company["biddingParty"].length === 0
                  ? "No bids yet"
                  : company["biddingParty"]}
              </span>

              <button
                onClick={() => this.bidCompany(company["id"], company["bids"])}
                disabled={!this.state.currentUser}
              >
                Bid
              </button>
            </li>
          ))}
        </ul>
        <div>
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
              disabled={this.state.currentUser !== "dev@cw.com"}
              onClick={() => this.resetStats()}
            >
              RESET <strong>DEV ONLY</strong>
            </button>
          </div>
          <div>
            <p>
              {this.state.currentUser
                ? `${this.state.currentUser}'s balance: ${this.formatAmount(
                    this.state.funds
                  )}`
                : "Login to bid"}
            </p>
          </div>
        </div>
        <label hidden={this.state.currentUser} htmlFor="email">
          Email
        </label>
        <input
          hidden={this.state.currentUser}
          type="email"
          id="email"
          name="email"
        />

        <label hidden={this.state.currentUser} htmlFor="pass">
          Password (8 characters minimum):
        </label>
        <input
          hidden={this.state.currentUser}
          type="password"
          id="pass"
          name="password"
          minLength="8"
          required
        />
        <button
          hidden={this.state.currentUser}
          onClick={(e) => this.createUser(e)}
        >
          CREATE ACCOUNT
        </button>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById("root"));
