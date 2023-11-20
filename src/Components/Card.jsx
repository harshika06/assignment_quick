import React from 'react'
import './Card.css';

function Card(props) {
  const shouldDisplayIcon = props.groupingOption === 'By User' || props.groupingOption === 'By Priority';
  const shouldDisplayIcon1 = props.groupingOption === 'By Status' || props.groupingOption === 'By User';

  return (

    <div className="card">


      <p>{props.id}</p>
      <div className='card-content'>
        {shouldDisplayIcon && (
          <span className="material-symbols-sharp">
            fiber_manual_record
          </span>
        )}

        <h4>{props.title.substring(0, 30)}{props.title.length > 30 ? "..." : null}</h4>


      </div>
      <div className='feature-request'>
        {shouldDisplayIcon1 && (
          <span className="material-symbols-sharp">
            more_horiz
          </span>
        )}
        <div className='features'>
          <img
            className="custom-image"
            src="https://i.pinimg.com/originals/63/9f/f2/639ff23f2fa0d07258f8d6290136d918.jpg"
            alt="Custom Tag Image"
          />
          <p >{props.tag[0]}</p>&nbsp;
        </div>
      </div>

    </div>
  )
}

export default Card