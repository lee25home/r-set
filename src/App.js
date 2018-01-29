import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

const list = [
  {
    title: "React",
    url: "https://facebook.github.io/react/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: "Redux",
    url: "https://github.com/reactjs/redux",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1
  }
];

function isSearched(searchTerm) {
  console.log('I am serachterm' + searchTerm);
  return function (item) {
    console.log('I am item' + item);
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

/**
 * const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());
 */

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: list,
      searchTerm: '',
    };
    //class binding are not automatic.

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    //to make 'this' accessible you have to bind the class method to 'this'
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    //update the list in internal component state!
    this.setState({ list: updatedList });
  }
  onSearchChange(event) {
    //event is the synthetic react event in your callback function
    this.setState({ searchTerm: event.target.value });
    //this.setState is a shallow merge.
    //list state in this case if dismissed would stay the same!
  }

  //Component[this.state] -> Render[view]

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to the React</h1> */}
        </header>
        <div className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
          <form>
            <input type="text"
            onChange={this.onSearchChange}
            />
          </form>
          {this.state.list.filter(isSearched(this.state.searchTerm))
            .map(item => {
            return (
              <div key={item.objectID}>
                <span>
                  <a href={item.url}>{item.title}</a>
                </span>
                <span>{item.author}</span>
                <span>{item.num_comments}</span>
                <span>{item.points}</span>
                <span>
                  <button
                    onClick={() => this.onDismiss(item.objectID)}
                    type="button"
                  >
                    Dismiss
                  </button>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
