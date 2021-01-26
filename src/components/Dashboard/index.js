import React, { Component } from 'react';
import { Link, withRouter} from 'react-router-dom';
import firebase from '../../firebase';
import './dashboard.css';

class Dashboard extends Component{

    constructor(props){
        super(props);
        this.state = {
            name: localStorage.name
        };

        this.logout = this.logout.bind(this);

    }

    async componentDidMount(){
        if(!firebase.getCurrent()){
            this.props.history.replace('./login');
            return null;
        }

        firebase.getUserName((info)=>{
            localStorage.name = info.val().name;
            this.setState({name: localStorage.name});
        })
    }

    logout = async () => {
        await firebase.logout()
        .catch((error)=>{
            console.log(error);
        });
        localStorage.removeItem("name");
        this.props.history.push('/');
    }

    render(){
        return(
            <div id="dashboard">
                <div className="user-info">
                <h1>Seja bem-vindo {this.state.name}</h1>
                <Link to="/dashboard/new">New Post</Link>
                </div>
                <p>Logado com: {firebase.getCurrent()}</p>
                <button onClick={()=> this.logout()}>Deslogar</button>
        </div>
        );
    }
}

export default withRouter(Dashboard);