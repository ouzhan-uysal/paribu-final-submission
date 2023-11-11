import Image from 'next/image';
import React, { FC } from 'react';
import { Button } from 'react-bootstrap';

type IPropertyCard = {
  type: 'Store' | 'Home';
  amount: number;
}

const PropertyCard: FC<IPropertyCard> = ({ type, amount }) => {
  return (
    <div className='property-card-container'>
      <Image src={`/samples/${type === 'Store' ? 'store.png' : 'home.png'}`} alt='property-img' width={200} height={200} />
      <h3>Type: {type}</h3>
      <h5>Amount: {amount}</h5>
      <Button>Apply</Button>
    </div>
  )
}

export default PropertyCard;