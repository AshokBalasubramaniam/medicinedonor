import React, { use } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function Donorlogin() {
  const navigate=useNavigate();
  return (
    <div>donorlogin

     <Link to="/Donorgetpatientdetails"></Link>
    </div>
  )
}

export default Donorlogin