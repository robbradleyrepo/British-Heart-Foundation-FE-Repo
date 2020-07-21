import 'react-app-polyfill/ie11'
import * as React from "react";
import { Component } from "react";
import * as ReactDOM from "react-dom";
import axios from "axios";
import * as jsonQuery from "json-query";

// Axios Intercept on LocalStorage - https://stackoverflow.com/questions/53475086/axios-intercept-not-applying-token-from-localstorage-on-first-call

// https://jsfiddle.net/69z2wepo/140614/

interface Props {
}

interface State {
	success: boolean;
	serverdata: Array<any>;
}

class MobileNav extends Component<Props, State> {

	private url: string;
	private node: Array<State>;

    constructor(props: any){
		super(props);
		this.url = 'http://api.jsonbin.io/b/5c9e16df1c56bb1ec3917402';

		this.state = {
			success: false,
			serverdata: []
		};
	}

	componentDidMount() {
		// evoked once by default
		console.log('React Lifecycle - componentWillMount - getData()');
		this.getData();
	}

	componentWillUnmount() {
		// to do: abort network request	
		console.log('React Lifecycle - componentWillUnmount - abort network request to do');
	}

	// consider async method?
	getData() {
		axios.get(this.url)
		
		.catch(function (error) {
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				// The request was made but no response was received
				console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log('Error', error.message);
			}
			console.log(error.config);
		})
		
		.then(( response ) => {
			// SUCCESS
			
			console.log('Axios: JSON retrieved ok');

			this.setState({ 
				success: true,
				serverdata: [response]
			});

			// localstorage ??
			// localStorage.setItem('data', obj);
			// this.props.history.replace({
			// 	pathname: `${this.props.match.url}/newRoute`,
			// 	search: '?someData=someValue',
			// })


		});
	}
	

	// navItem(props: any) {
	// 	return ( 
	// 		<li>
	// 			<a href="{props.link}">{props.title}</a>
	// 		</li>
	// 	);
	// }

	

	// needs to be wrapped in componentDidMount?
	render() {

		// FAIL
		if (!this.state.success) {
			return null;
		}

		let data = this.state.serverdata;
		//console.log(data);
		//let nodeItem:IRootObject;
		
		
		let queryResult: any = jsonQuery('[*_grandchildren=7]', {data: data} );
		console.log(queryResult);

		for (const items in data) {
			const node = data[items].data.navigation.node
			//console.log(node);
	
			return (
				<div>
					<ul>
						{node.map((node, i) => <li key={i}>{node._title}</li>
						)}
					</ul>
				</div>
			);
		}	

		// https://codesandbox.io/s/l348nnkv9q

		// 	<this.navItem title="Nav item 1" link="http://hyperlink1" />
		// 	<this.navItem title="Nav item 2" link="http://hyperlink2" />
		// 	<this.navItem title="Nav item 3" link="http://hyperlink3" />
		// }		
	}
}


$(() => {
	const ComponentClass = document.querySelector(".c-nav-mobile");

	ReactDOM.render(
		<MobileNav />, ComponentClass
	);
});
