import './App.css';
import {useState} from 'react';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import initializeAuthentication from './Firebase/firebase.init';
const googleProvider = new GoogleAuthProvider();

initializeAuthentication();
function App() {
const [name,setName]=useState('');
const [email,setEmail]=useState('');  
const [password,setPassword]=useState('');
const [error,setError]=useState('');
const [isLogin,setIsLogin]=useState(false);


const auth = getAuth();


  const handleGoogleSignIn=()=>{
    signInWithPopup(auth, googleProvider)
    .then(result=>{
      const user= result.user;
      console.log(user);
    })
  }
const toggleLogin = (e) => {
  setIsLogin(e.target.checked);
}

const handleNameChange=(e)=>{
setName(e.target.value)
}

const handleEmailChange=(e)=>{
    setEmail(e.target.value);
}
const handlePasswordChange = (e) => {
  setPassword(e.target.value);
}



const handleRegistration= e => {
  console.log(email,password);
  e.preventDefault();
  if(password.length<6){
    setError('Password must be 6 character a long .')
    return;
  }
  if(!/(?=.*[A-Z].*[A-Z])/.test(password)){
    setError("password must be 2 upear case");
    return;
  }
  isLogin? processloggin(email,password):registerNewUser(email,password);
  
}
const processloggin=(email,password)=>{
  signInWithEmailAndPassword(auth,email,password)
  .then(result => {
    const user=result.user;
    setError("");
    console.log(user)
   
  })
  .catch(error => {
    setError(error.message);
  })
}
const registerNewUser=(email,password)=>{
  createUserWithEmailAndPassword(auth,email,password)
  .then(result => {
    const user =result.user;
    console.log(user);
    setError("");
    verifyEmail();
    setUserName();
  })
  .catch(error => {
    setError(error.message);
  })
}
const setUserName =()=>{
  updateProfile(auth.currentUser,{displayName:name})
  .then(result => {})
}


const verifyEmail=()=> {
  sendEmailVerification(auth.currentUser)
  .then( result => {
   
    console.log(result);
  })
}

const handleResetPassword=()=>{
  sendPasswordResetEmail(auth, email)
  .then( result => {})
}



  return (
    <div className="mx-5 mt-5">
     <form onSubmit={handleRegistration}>
       <h3 className="text-primary">{isLogin? 'login': 'Register'}</h3>
      {!isLogin&&
        <div className="row mb-3">
    <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
    <div className="col-sm-10">
     <input type="text" onBlur={handleNameChange} className="form-control" id="input" placeholder="your name"/>
    </div>
  </div>
       }
       
     
  <div className="row mb-3">
    <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
    <div className="col-sm-10">
      <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" required/>
    </div>
  </div>
  <div className="row mb-3">
    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
    <div className="col-sm-10">
      <input onBlur={handlePasswordChange} type="password" className="form-control" id="inputPassword3" required />
    </div>
  </div>
  
  <div className="row mb-3">
    <div className="col-sm-10 offset-sm-2">
      <div className="form-check">
        <input onChange={toggleLogin} className="form-check-input" type="checkbox" id="gridCheck1"/>
        <label className="form-check-label" htmlFor="gridCheck1">
         Already Register
        </label>
        <input  onClick={handleResetPassword} className="btn btn-warning text-white rounded-pill" type="reset" value="Reset-Password"/>
      </div>
    </div>
  </div>
  <div className="text-danger">{error}</div>
  <button  type="submit" className="btn btn-primary">{isLogin?'login' :'Register'}</button>
  
  <br />
  <br />
  
</form>









<br />


 <br /><br /><br />
      <div>------------------------</div>
     

      <br /><br />
       <button onClick={handleGoogleSignIn}>Google SignIn</button> 
    </div>
  );
}

export default App;
