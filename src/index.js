import React, { Component } from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import config from "./firestore";

class Main extends Component {
  constructor() {
    console.log(config);
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    super();
    this.state = {
      companies: [],
      changes: [],
    };
    this.db = firebase.firestore();
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
    // this.setState({
    //   companies: this.state.companies.map((i) => {
    //     if (i.id === id) {
    //       i.bids += 1;
    //       return i;
    //     } else return i;
    //   }),
    // });

    this.db
      .collection("companies")
      .doc(id)
      .update({
        bids: bids + 1,
      });
  };

  render() {
    return (
      <ul>
        {this.state.companies.map((company) => (
          <li key={company["id"]}>
            <strong>{company["companyName"]}</strong>
            <span>{"    "}</span>
            <em>{company["bids"]}</em>
            <span>{"    "}</span>

            <button
              onClick={() => this.bidCompany(company["id"], company["bids"])}
            >
              Bid
            </button>
          </li>
        ))}
      </ul>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById("root"));
