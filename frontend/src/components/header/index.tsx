import { useWeb3Assistant } from 'components/contexts/Web3AssistantContext';
import React from 'react'
import { Button } from 'react-bootstrap';

const Header = () => {
  const { account } = useWeb3Assistant();

  return (
    <div className='header-container'>
      <div className="logo"></div>
      <div className="actions">
        {account ?
          <Button>Profile</Button>
          :
          <Button>Connect</Button>
        }
      </div>
    </div>
  )
}

export default Header;