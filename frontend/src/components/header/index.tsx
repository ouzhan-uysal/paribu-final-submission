
import Image from 'next/image';
import React from 'react'
import { Button } from 'react-bootstrap';
import { useWeb3 } from 'src/contexts/Web3Context';

const Header = () => {
  const { account, connectToWallet } = useWeb3();

  return (
    <div className='header-container'>
      <div className="logo">
        <Image src="/paribu-logo.svg" alt='logo' width={150} height={65} />
      </div>
      <div className="actions">
        {account ?
          <Button disabled>{account.slice(0, 5)}...{account.slice(-5)}</Button>
          :
          <Button onClick={connectToWallet}>Connect</Button>
        }
      </div>
    </div>
  )
}

export default Header;
