import React from 'react'
import { Link } from 'react-router-dom'

export const DashboardAction = () => {
    return (
        <div className="dash-buttons">
        <Link to="/edit-profile" className="btn-1 btn-light">
        <i className="fas fa-user-circle text-primary">
        </i> Edit Profile</Link>

        <Link to="/add-experience" className="btn-1 btn-light">
        <i className="fab fa-black-tie text-primary">
        </i> Add Experience</Link>

        <Link to="/add-education" className="btn-1 btn-light">
        <i className="fas fa-graduation-cap text-primary">
        </i> Add Education</Link>
      </div>
    )
}
