import "react-app-polyfill/ie11";
import * as React from "react";
import { Component, FC, Fragment } from "react";
import * as ReactDOM from "react-dom";
import axios, { AxiosResponse } from "axios";
import * as jsonQuery from "json-query";
import { node } from "prop-types";

interface Props {}

interface State {
  status: Status;
  data: Array<Node>;
  prevLevel: Array<any>;
  currentLevel: Array<any>;
  nextLevel: Array<any>;
}

enum Status {
  //initial,
  loading,
  error,
  success
}

const transitionMiliseconds = 3000;

class MobileNav extends Component<Props, State> {
  private url: string;

  constructor(props: any) {
    super(props);
    this.url = "https://api.jsonbin.io/b/5d012a30306724684b0d33cb/1";
    this.getData = this.getData.bind(this);
    this.showNextLevel = this.showNextLevel.bind(this);
    this.resetLevels = this.resetLevels.bind(this);
    this.state = {
      prevLevel: [],
      currentLevel: [],
      nextLevel: [],
      status: Status.loading,
      data: []
    };
  }

  componentDidMount() {
    // evoked once by default
    console.log("React Lifecycle - componentWillMount - getData()");
    this.getData();
  }

  componentWillUnmount() {
    // to do: abort network request
    console.log(
      "React Lifecycle - componentWillUnmount - abort network request to do"
    );
  }

  // consider async method?
  getData() {
    axios
      .get(this.url)

      .catch(function(error) {
        const { response, request, message, config } = error;

        if (response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(response.data);
          console.log(response.status);
          console.log(response.headers);
        } else if (request) {
          // The request was made but no response was received
          console.log(request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", message);
        }
        console.log(config);

        this.setState({
          status: Status.error
        });
      })

      .then((response: AxiosResponse<NavigationResponse>) => {
        // SUCCESS

        console.log("Axios: JSON retrieved ok");
        //console.log(response.navigation.node);
        this.setState({
          status: Status.success,
          data: response.data.navigation.nodeRoot
        });
      });
  }

  showNextLevel(data: Array<Node>) {
    this.setState({
      nextLevel: data
    });
  }

  resetLevels(currentLevel: Array<Node>) {
    this.setState({
      nextLevel: [],
      prevLevel: [],
      currentLevel: currentLevel
    });
  }

  // needs to be wrapped in componentDidMount?
  render() {
    const { data, status } = this.state;

    // FAIL
    if (status == Status.loading) {
      return <p>loading...</p>;
    } else if (status == Status.error) {
      return <p>error...</p>;
    } else if (status == Status.success) {
      const { nextLevel } = this.state;

      return (
        <div style={{ width: "800px" }}>
          <Nodelevel data={data} showNextLevel={this.showNextLevel} />
          {this.state.nextLevel.length ? (
            <Nodelevel
              isNextLevel={true}
              data={nextLevel}
              showNextLevel={this.showNextLevel}
            />
          ) : null}
        </div>
      );
    }
  }
}

interface NavigationResponse {
  navigation: {
    nodeRoot: Array<Node>;
  };
}

interface Node {
  url: string;
  label: string;
  id: string;
  nodeChildren?: Array<Node>;
}

interface NodeItemProps {
  url: string;
  label: string;
  showNextLevel: (node: Array<Node>) => void;
  nodeChildren: Array<Node>;
  isAnimating?: boolean;
}

interface NodeLevelProps {
  data: Array<Node>;
  showNextLevel: (node: Array<Node>) => void;
  isNextLevel?: boolean;
}

const NodeItem: FC<NodeItemProps> = ({
  url,
  label,
  showNextLevel,
  nodeChildren,
  isAnimating
}) => {
  return (
    <li>
      <a onClick={() => showNextLevel(nodeChildren)}>{label}</a>
    </li>
  );
};

interface NodelevelState {
  marginLeft: string;
}
class Nodelevel extends Component<NodeLevelProps, NodelevelState> {
  constructor(props: any) {
    super(props);

    this.state = {
      marginLeft: "0"
    };
  }

  componentDidMount() {
    console.log("component didmount");

    if (this.props.isNextLevel) {
      console.log("transation " + this.state.marginLeft);
      this.setState({
        marginLeft: "-400px"
      });
    }
  }

  render() {
    const { data = [], showNextLevel, isNextLevel } = this.props;
    console.log("render " + this.state.marginLeft);
    //debugger;
    return (
      <ul
        className="thiswillbeacoolclass"
        style={{
          marginLeft: this.state.marginLeft,
          width: "400px",
          border: "1px solid red",
          float: "left",
          transition: `all ${transitionMiliseconds / 1000}s ease-in-out`
        }}
      >
        {data.map(nodeItem => (
          <NodeItem
            url={nodeItem.url}
            label={nodeItem.label}
            key={nodeItem.id}
            showNextLevel={showNextLevel}
            nodeChildren={nodeItem.nodeChildren}
          />
        ))}
      </ul>
    );
  }
}

$(() => {
  const ComponentClasses = document.querySelectorAll(".c-nav-mobile");

  ComponentClasses.forEach(ComponentClass => {
    ReactDOM.render(<MobileNav />, ComponentClass);
  });
});
