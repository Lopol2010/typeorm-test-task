import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'

class UserList extends React.Component {

    constructor(props){
        super(props)
        this.items = null
        this.state = {
            userId: null,
            removing: false
        }
        this.spinner = <div className="spinner-border spinner-border-sm" role="status">
                            <span className="sr-only">Удаление...</span>
                        </div> 
    }

    updateAnimation(userId) {
        this.setState({userId})
        setTimeout(() => {
            this.setState({userId: null})
        }, 50);
    }

    onClickRemoveAll(){
        this.setState({removing: true})
        this.props.onRemoveAll().then(()=> {
            this.setState({removing: false})
        })
    }

    render(){
        if (this.props.users.length > 0) {
            this.items = this.props.users.map((user, i) => {
                let classList = "row row-cols-3 user-list-item "
                if(this.state.userId === user.id){
                    classList += "alert-update"
                }
                return <div key={user.id} className={classList}>
                            <div className="col">{user.name}</div>
                            <div className="col">{user.username}</div>
                            <div className="col">{user.email}</div>
                        </div>
                })
        } else {
            this.items = <div className="row row-cols-3">
                            <div className="col">—</div>
                            <div className="col">—</div>
                            <div className="col">—</div>
                        </div>
                
        }
        // this.setState({userId: null})
        return <div>
                    <h5 className="mt-5">База данных</h5>
                    <button className="btn btn-link p-0" 
                            onClick={()=>{this.onClickRemoveAll()}}>{this.state.removing ? this.spinner : "Удалить все"}</button>
                    <div className="row row-cols-3 mb-1 font-weight-bold">
                        <div className="col">Имя</div>
                        <div className="col">Ник</div>
                        <div className="col">E-mail</div>
                    </div>
                    {this.items}
                </div>
    }
}

class UrlInput extends React.Component {

    constructor(props){
        super(props)

        this.spinner = <div className="spinner-border spinner-border-sm" role="status">
                            <span className="sr-only">Загрузка...</span>
                        </div>  
        this.state = {
            url: "https://jsonplaceholder.typicode.com/users/1"
        }

    }

    onInput(event) {
        this.setState({url: event.target.value})
    }

    render() {

        return (
        // <label>Ссылка на профиль</label>
            <div className="input-group">
                <input defaultValue={this.state.url} type="text" className="form-control" id="url-field" 
                        onInput={(event)=> this.onInput(event) }></input>
                <div className="input-group-append">
    
                    <button disabled={this.props.isLoading} 
                            className="btn btn-primary btn-add" 
                            onClick={()=> this.props.onClickSave(this.state.url) }>
                                {this.props.isLoading ? this.spinner : "Сохранить"}</button>
                </div>
            </div>
        )
    }

}

class App extends React.Component {

    constructor(props) {
        super(props)
        
        this.state = {
            users: [],
            canSave: true,
        }
        this.userList = React.createRef()
    }

    async componentDidMount() {
        let users = await this.getUsers()
        this.setState({users: users})
    }

    render() {

        return (<div className="container mt-5">
            <div className="row">
                <div className="col"></div>
                <div className="col-7">
                    
                    <UrlInput isLoading={!this.state.canSave} 
                         onClickSave={(url)=>{ this.saveUser(url) }}></UrlInput>
                    <UserList onRemoveAll={()=>{ return this.removeAll() }} ref={this.userList} users={this.state.users}></UserList>
                </div>
                <div className="col">
                </div>
            </div>
        </div>
        )
        
    }

    async removeAll() {
        let response = await fetch('http://localhost:3000/users', {
            method: "delete",
        })
        .then(response => response.json())
        .then(()=>{
            this.setState({users: []})
        })
        .catch(err => { console.log(err) })
        return response
    }

    async getUsers() {

        let response = await fetch('http://localhost:3000/users')
            .then(response => response.json())
            .catch(err => { console.log(err) })
        return response
    }

    async saveUser(url) {
      
        this.setState({canSave: false})
        let user = await fetch(url).then(response => response.json())
 
        console.log("Saving data: ")
        console.log(user)
        
        let response = await fetch('http://localhost:3000/users', 
            {
                method: 'POST', 
                body: JSON.stringify(user),
                headers: {"Content-Type": "application/json"}
            })
            .then(response => response.json())
            .then(data => {

                let users = this.state.users.slice()
                let toUpdate = users.find((usr) => usr.email === data.email)
                if (toUpdate) {
                    Object.assign(toUpdate, data)
                    this.userList.current.updateAnimation(data.id)
                    console.log("User updated.") 
                } else {
                    users.push(data)
                    console.log("User saved.")
                }
                this.setState({users, canSave: true})
                
            })
            .catch(err => { console.log(err) })
        
    }
}

ReactDOM.render(<App />, document.getElementById("App"))