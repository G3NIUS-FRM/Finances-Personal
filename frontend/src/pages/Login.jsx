import React from "react";
import '../styles/login.css'
import { useState } from "react";
export default function Login() {
    const [username , setUsername] = useState('');
    const [password , setPassword] = useState('');
    const [error, setError] = useState(null);
    const handleSubmit= async(e)=>{
        e.preventDefault();
        const body=JSON.stringify({'username':username,'password':password})
        const res=   await fetch('http://127.0.0.1:8000/api/token/',{
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: body
        })
        if (res.ok){
            const data = await res.json();
            localStorage.setItem('token', JSON.stringify(data));
            localStorage.setItem('username', username)
            window.location.href ='/dashboard'
        } else{
            setError('Usuario o contrasena incorrectos')
            setUsername('');
            setPassword('');

        }
    }

  return (
    <div className="container">
            {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5">Sign In</h5>
              <form onSubmit={(e)=>handleSubmit(e)}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Exaple: Adrian123"
                    name="username"
                    value={username}
                    onChange={(e)=> setUsername(e.target.value)}
                  />
                  <label htmlFor="floatingInput">Username</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="rememberPasswordCheck"
                  />
                  <label className="form-check-label" htmlFor="rememberPasswordCheck">
                    Remember password
                  </label>
                </div>
                <div className="d-grid">
                  <button
                    className="btn btn-primary btn-login text-uppercase fw-bold"
                    type="submit"
                    
                  >
                    Sign in
                  </button>
                </div>
                <hr className="my-4" />
              </form>
              <p className="text-center mt-3">
                Don't have an account?{' '}
                <a href="/register" className="text-primary">
                  Register here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
