import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import firebase from '../../firebase';
import './new.css';

class New extends Component{

    constructor(props){
        super(props);
        this.state = {
            title: '',
            image: null,
            url: '',
            description: '',
            alert: '',
            progress: 0
        }
        this.cadastrar = this.cadastrar.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }

    componentDidMount(){
        if(!firebase.getCurrent()){
            this.props.history.replace('./');
            return null;
        }
    }

    cadastrar = async(e) =>{
        e.preventDefault();

        if(this.state.title !== '' && 
        this.state.image !== '' && 
        this.state.description !== '' &&
        this.state.image !== null &&
        this.state.url !== ''){
            let posts = firebase.app.ref('posts');
            let chave = posts.push().key;
            await posts.child(chave).set({
                title: this.state.title,
                image: this.state.url,
                description: this.state.description,
                author: localStorage.name
            });

            this.props.history.push('/dashboard');
        }else{
            this.setState({alert: 'Preencha todos os campos!'});
        }
    }

    handleFile = async(e) =>{
        if(e.target.files[0]){
            const image = e.target.files[0];
            if(image.type === 'image/png' || image.type === 'image/jpeg'){
                await this.setState({image: image});
                this.handleUpload();
            }else{
                alert('Envie uma imagem do tipo PNG ou JPG');
                this.setState({image: null});
                return null;
            }
            
        }
        
    }

    handleUpload = async() => {
        const { image } = this.state;
        const currentUid = firebase.getCurrentUid();

        const uploadTaks = firebase.storage
        .ref(`images/${currentUid}/${image.name}`)
        .put(image);

        await uploadTaks.on('state_changed',
        (snapshot)=>{
            //progress
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                this.setState({progress});
        },
        (error)=>{
            console.log('Error imagem: ' + error);
        },
        ()=>{
            //enviou a imagem, com sucesso
            firebase.storage.ref(`images/${currentUid}`)
            .child(image.name).getDownloadURL()
            .then(url => {
                this.setState({url: url});
            })

        })
    }

    render(){
        return(
        <div>
            <header id="new">
                <Link to="/dashboard">Voltar</Link>
            </header>
            <form onSubmit={this.cadastrar} id="new-post">

                <span>{this.state.alert}</span>

                <input type="file" onChange={this.handleFile} /><br/>
                {this.state.url !== '' ?
                <img src={this.state.url} width="250" height="150" alt="Capa do post" />
                : 
                <progress value={this.state.progress} max="100" />   
                }

                <label>Título:</label><br/>
                <input type="text" placeholder="Nome do post" value={this.state.title} autoFocus
                onChange={(e)=> this.setState({title: e.target.value})}/><br/>

                <label>Descrição:</label><br/>
                <textarea type="text" placeholder="Descrição do post" value={this.state.description} 
                onChange={(e)=> this.setState({description: e.target.value})}/><br/>
            
            <button type="submit">Cadastrar</button>
            </form>
        </div>
        );
    }
}

export default withRouter(New);