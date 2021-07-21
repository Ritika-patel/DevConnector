import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';

const PostItem = ({
addLike,
removeLike,
deletePost,
auth,
  post: { _id, text, name, user, avatar, likes, comments, date },
  showActions
}) => {


  return (
  <Fragment>
  


  <div className={`post p-1 my-1`}>
    <div>
      <Link to={`/profile/${user}`}>
        <img className='round-img' src={avatar} alt='' />
        <h4>{name}</h4>
      </Link>
    </div>
    <div>
      <p className='my-1'>{text}</p>
      <p className='post-date'>
        Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
      </p>

      {showActions && (
        <Fragment>
          <button
            onClick={e => addLike(_id)}
            type='button'
            className='btn-1 btn-light'
          >
            <i className='fa fa-thumbs-up' />{' '}
            <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
          </button>
          <button
            onClick={e => removeLike(_id)}
            type='button'
            className='btn-1 btn-light'
          >
            <i className='fa fa-thumbs-down' />
          </button>
          <Link to={`/posts/${_id}`} className='btn-1 btn-primary'>
            comment{' '}
            {comments.length > 0 && (
              <span className='comment-count'>{comments.length}</span>
            )}
          </Link>
          {/* <a href={`mailto:${email}`} className='btn btn-primary'>email</a> */}
          {!auth.loading && user === auth.user._id && (
            <button
              onClick={e => deletePost(_id)}
              type='button'
              className='btn btn-danger'
            >
              <i className='fa fa-times' />
            </button>
          )}
        </Fragment>
      )}
    </div>
  </div>
  </Fragment>
);
  }
PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addLike, removeLike, deletePost }
)(PostItem);
