import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, loading, user }, logout, profile: { profile } }) => {


;

  let userId = '#!';
    if(isAuthenticated && user !== null) userId = user._id;

  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles'> Developers</Link>
      </li>
        <li>
      <Link to={`/profile/${userId}`}>
        Profile
      </Link>
       </li>
      <li>
        <Link to='/posts'>Posts</Link>
      </li>
      <li>
        <Link to='/dashboard'>Dashboard
        </Link>
      </li>
      <li>
        <a onClick={logout} href='#!'>Logout

        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  return (
   
    <nav className='navbar bg-dark'>

      <h1 className='devconnect'>
        <Link to='/'>
          <i className='fa fa-code' /> DevConnector
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>

  );
};
Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
