import React, { Component } from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
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
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          currentUser: user.displayName,
          funds: 3000,
        });
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
              biddingParty: "", //REMOVE THIS LINE IN PROD
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
  };

  setAmount = (bids) => {
    const initAmount = 900;
    const calculatedAmount = bids * 25;
    const result = (initAmount + calculatedAmount).toString();
    return `₹${result.slice(0, -2)}${
      result.slice(-2) === "00" ? "" : "." + result.slice(-2)
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

  loginUser = (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    this.auth
      .signInWithEmailAndPassword(email, password)
      .then((res) => console.log(res));
  };

  render() {
    return (
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
              disabled={this.state.currentUser.length !== 0 ? false : true}
            >
              Bid
            </button>
          </li>
        ))}
        <button
          disabled={this.state.currentUser.length !== 0}
          onClick={() => {
            if (this.state.currentUser.length === 0) {
              this.auth.signInWithPopup(this.provider).then((res) => {
                this.setState({
                  currentUser: res.user.displayName,
                  funds: 3000,
                });
              });
            }
          }}
        >
          {this.state.currentUser.length === 0
            ? "Sign in with Google"
            : `Signed in as ${this.state.currentUser}`}
        </button>
        <div>
          <button
            disabled={this.state.currentUser !== "Suraj Govind"}
            onClick={() => this.resetStats()}
          >
            RESET <strong>DEV ONLY</strong>
          </button>
        </div>
      </ul>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById("root"));
