import React from 'react'
import { useState } from 'react';
export default function Register() {
    const [firstName, setFirstName]=useState('');
    const [lastName, setLastName]= useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1]= useState('');
    const [password2, setPassword2]= useState('');
    const [error, setError] =useState(null);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const body =JSON.stringify({
            'first_name': firstName,
            'last_name':lastName,
            'username': username,
            'email': email,
            'password1':password1,
            'password2': password2
        })
        const res = await fetch('http://127.0.0.1:8000/api/register/', {
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body:body
        })
        if (res.ok) {
            window.location.href ='/login'
        }else{
            const errorData= await res.json();
            setError(errorData.error || 'Error al registrar el usuario')
            setFirstName('');
            setLastName('');
            setUsername('');
            setEmail('');
            setPassword1('');
            setPassword2('');
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
                        placeholder="Example: Adrian123"
                        name='first_name'
                        value={firstName}
                        onChange={(e)=> setFirstName(e.target.value)}
                      />
                      <label htmlFor="floatingInput">First Name</label>
                    </div>
                  <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Example: Adrian123"
                        name='last_name'
                        value={lastName}
                        onChange={(e)=> setLastName(e.target.value)}
                      />
                      <label htmlFor="floatingInput">Last Name</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Example: Adrian123"
                        name='username'
                        value={username}
                        onChange={(e)=> setUsername(e.target.value)}
                      />
                      <label htmlFor="floatingInput">Username</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="email"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Example: Adrian123"
                        name='email'
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        />
                      <label htmlFor="floatingInput">Email</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        name='password1'
                        value={password1}
                        onChange={(e)=> setPassword1(e.target.value)}
                      />
                      <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        name='password2'
                        value={password2}
                        onChange={(e)=> setPassword2(e.target.value)}
                      />
                      <label htmlFor="floatingPassword">Confirm Password</label>
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
                  Already have an account?{' '}
                    <a href="/login" className="text-primary">
                      Sign in here
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}
