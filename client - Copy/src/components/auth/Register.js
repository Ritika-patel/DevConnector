import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import { setAlert } from '../../actions/alert'
import PropTypes from 'prop-types';
import { register } from '../../actions/auth';

 
const Register = ({ setAlert, register, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        name:'',
        email:"",
        password:"", 
        password2:""
    })

    const {name, email, password, password2} = formData

    const onChange = e => setFormData({
        ...formData, [e.target.name]:e.target.value
    })

    const onSubmit = async (e) => {
        e.preventDefault()
        if(password !== password2){
            setAlert('passwords do not match', 'danger')
        }else{
            register({ name, email, password })
        }
    }

        //Redirect if logged in
        if(isAuthenticated){
          return <Redirect to ='/dashboard' />
        }

    return (
        <Fragment>
        <h1 className="large">Sign Up</h1>

        <form className="form" onSubmit={ e => onSubmit(e)} >
        

            
          <div className="form-group">
             <div className="iii">
             <div className='Margin'>
             <i className="fas fa-user" />
             </div>
            <input 
              autocomplete="off"
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={e => onChange(e)}
              // required
            />
            </div>
            </div>
          
          <div className="form-group">
          <div className="iii">
             <div className='Margin'>
             <i className="fas fa-envelope" />
             </div>
          
            <input
            autocomplete="off"
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={e => onChange(e)}
              // required
            />
            </div>
            
            <small className="form-text">
              This site uses Gravatar so if you want a profile image, use a
              Gravatar email
            </small>
          </div>


          <div className="form-group">
          <div className="iii">
             <div className='Margin'>
             <i className="fas fa-unlock-alt" />
             </div>
            <input
            autocomplete="off"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={e => onChange(e)}
              // required
            />
          </div>
          </div>


          <div className="form-group">
          <div className="iii">
             <div className='Margin'>
             <i className="fas fa-unlock-alt" />
             </div>
            <input
            autocomplete="off"
              type="password"
              placeholder="Confirm Password"
              name="password2"
              value={password2}
              onChange={e => onChange(e)}
              // required
            />
          </div>
          </div>

           
          <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </Fragment>
    )
  }

  Register.ProtoTypes = {
      setAlert: PropTypes.func.isRequired,
      register:PropTypes.func.isRequired,
      isAuthenticated: PropTypes.bool
  }
  const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
  })

export default connect(mapStateToProps, { setAlert, register })(Register);