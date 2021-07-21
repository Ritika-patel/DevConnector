import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProfileTop = ({
  profile: {
    status,
    company,
    location,
    website,
    social,
    user: { name, avatar }
  }
}) => (
    <div className='profile-top bg-primary p-2'>
      <img className='round-img my-1' src={avatar} alt='' />
      <h1 className='large'>{name}</h1>
      <p className='lead'>
        {status} {company && <span> at {company}</span>}
      </p>
      <p>{location && <span>{location}</span>}</p>
      <div className='icons my-1'>
        {website && (
          <Link href={website} target='_blank' rel='noopener noreferrer'>
            <i className='fa fa-globe fa-2x' />
          </Link>
        )}
        {social && social.twitter && (
          <Link href={social.twitter} target='_blank' rel='noopener noreferrer'>
            <i className='fa fa-twitter  fa-2x' />
          </Link>
        )}
        {social && social.facebook && (
          <Link href={social.facebook} target='_blank' rel='noopener noreferrer'>
            <i className='fa fa-facebook fa-2x' />
          </Link>
        )}
        {social && social.linkedin && (
          <Link href={social.linkedin} target='_blank' rel='noopener noreferrer'>
            <i className='fa fa-linkedin fa-2x' />
          </Link>
        )}
        {social && social.youtube && (
          <Link href={social.youtube} target='_blank' rel='noopener noreferrer'>
            <i className='fa fa-youtube fa-2x' />
          </Link>
        )}
        {social && social.instagram && (
          <Link href={social.instagram} target='_blank' rel='noopener noreferrer'>
            <i className='fa fa-instagram fa-2x' />
          </Link>
        )}
      </div>
    </div>
  );

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileTop;
