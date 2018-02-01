import React, { Component } from "react";
import "./App.css";

const DEFAULT_QUERY = "js";
const DEFAULT_HPP = "100";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

class App extends Component {
  constructor(props) {
    //runs once in a lifetime
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };
    //class binding are not automatic.

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    //to make 'this' accessible you have to bind the class method to 'this'
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const oldHits = page !== 0 ? this.state.result.hits : [];
    //when the page is 0, new search request - no hits
    //"MORE" old hits stored
    const updatedHits = [...oldHits, ...hits];
    this.setState({ result: { hits: updatedHits, page } });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => e);
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      //avoid mutated objects - immutable is best
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
    //this.setState is a shallow merge.
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  render() {
    //Component[this.state] -> Render[view]
    console.log(this.state);
    const { searchTerm, result } = this.state;

    const page = (result && result.page) || 0;

    if (!result) {
      return null;
    }

    return (
      <div className="App">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search Article Titles
          </Search>
        </div>
        {/* 
        //Condiitional Rendering - present null if no hits on default query 
            alternate -> result && ''
        */}
        {result && <Table list={result.hits} onDismiss={this.onDismiss} />}
        <div className="interactions">
          <Button
            onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}
          >
            MORE
          </Button>
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    {children}
    <input type="text" value={value} onChange={onChange} />
    <button type="submit"> {children} </button>
  </form>
);

const Table = ({ list, onDismiss }) => (
  <div className="table">
    {list.map(item => (
      <div key={item.objectID} className="table-row">
        <span style={{ width: "40%" }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: "30%" }}>{item.author}</span>
        <span style={{ width: "10%" }}>{item.num_comments}</span>
        <span style={{ width: "10%" }}>{item.points}</span>
        <span style={{ width: "10%" }}>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Dismiss
          </Button>
        </span>
      </div>
    ))}
  </div>
);

const Button = ({ onClick, className = "", children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);

//Side Note:
/**
 * These are the ES6 class components available;
 
 * Functional Stateless Components : input == props, output == jsx
 * They are functions -> no local state
 * Cannot access or update state (this.state, or this.setState())
 * NO this object
 * NO lifecycle methods /No lifecycle
 
 * Class Components: extend the React component
 * hooks all lifecycle methods, 
 * you can store and manipulate ES6 components(this.state, this.setState()) 
 * 
 * React.createClass  - since deprecated
 * 
 */

// Side Note 2
/**
 * React Lifecycle:
 * constructor called when component is created and inserted
 * When component is instantiated is is "mounting the component"
 *
 * Render is called on mounting AND component update
 *
 * constructor -> componentWillMount() -> render() -> componentDidMount()
 *
 * Update lifecycle of a component when state/props change
 * componentWillRecieveProps() -> shouldComponentUpdate() -> componentWillUpdate() -> render() -> componentDidUpdate()
 *
 * Unmounting
 * componentWillUnmount()
 *
 * Examples:
 *
 * constructor -> set initial component state and bind class methods
 *
 * componentWillMount->set internal component state
 *
 * render-> returns elements as ouput (input as props and state)
 *
 * componentDidMount->once when component mounted (good for asyncy calls  and store )
 *
 * componentWillReceiveProps(nextProps)-> diff next props with previous props (this.props)
 *
 * shouldComponentUpdate(nextProps, nextState)-> called when state or props change, perforamnce optimzations
 *
 * componentWillUpdate(nextProps, nextState)-> immediately before render(), last opportunity to execute (no longer trigger setState())
 *
 * componentDidUpdate(prevProps,prevState)-> invoked after render(), perform DOM operations or more async tasks
 *
 * componentWillUnmount() -> called before component destruction
 */

export default App;
