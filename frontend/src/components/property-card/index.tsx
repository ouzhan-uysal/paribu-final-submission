import Image from 'next/image';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useWeb3 } from 'src/contexts/Web3Context';
import { IProperty } from 'src/interface/property.interface';

type IPropertyCard = {
  property: IProperty;
  operation: "Apply" | "Terminate" | "Approve" | undefined;
  onClick: (propertyId: number) => void;
  handleDeny?: (propertyId: number) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  applyFields?: {
    startDate: number;
    endDate: number;
  };
  setApplyFields?: Dispatch<SetStateAction<{
    startDate: number;
    endDate: number;
  }>>;
}

const PropertyCard: FC<IPropertyCard> = ({ property, operation, onClick, applyFields, setApplyFields, handleDeny }) => {
  const { account } = useWeb3();
  const [applyModal, setApplyModal] = useState<boolean>(false);

  return (
    <div className='property-card-container'>
      <Image src={`/samples/${property.type === 'Store' ? 'store.png' : 'home.png'}`} alt='property-img' width={200} height={200} />
      <h3>
        <span className='text-muted'>Type: </span>{property.type}
      </h3>
      <h4>
        <span className='text-muted'>Amount: </span>{property.amount}
      </h4>
      <h5>
        <span className='text-muted'>Address: </span>{property.address}
      </h5>
      {(operation === "Terminate" || operation === undefined) && <h5>
        <span className='text-muted'>End Date: </span>{new Date(property.endDate).toLocaleDateString("tr")}
      </h5>}

      {operation && <Button
        variant={(operation === "Apply" && (property.owner?.toLocaleLowerCase() === account?.toLocaleLowerCase() || property.isRented))
          ? 'danger' : operation === "Approve" ? 'warning' : 'primary'}
        onClick={() => operation === "Apply"
          ? setApplyModal(true)
          : onClick(property.propertyId)}
        disabled={(operation === "Apply" && (property.owner?.toLocaleLowerCase() === account?.toLocaleLowerCase() || property.isRented || property.tenant !== "0x0000000000000000000000000000000000000000"))
          ? true : false}>
        {(operation === "Apply" && property.owner?.toLocaleLowerCase() === account?.toLocaleLowerCase())
          ? 'Your Property'
          : operation === "Apply" && property.isRented ? 'Rented' : operation === "Apply" && property.tenant !== "0x0000000000000000000000000000000000000000"
            ? 'Pending Approval'
            : operation}
      </Button>}
      {operation === "Approve" && handleDeny && <Button variant='danger' onClick={() => handleDeny(property.propertyId)}>Deny</Button>}

      {applyFields && setApplyFields && <Modal show={applyModal} onHide={() => setApplyModal(false)} size='sm' centered>
        <Modal.Header closeButton>
          <Modal.Title>Make Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-3 align-items-center">
            <div className="col">
              <label htmlFor="startdate" className='fw-bold'>Start Date:</label>
            </div>
            <div className="col">
              <input id='startdate' type="date" className='custom-date-container'
                value={new Date(applyFields.startDate).toISOString().substring(0, 10)}
                onChange={(e) => setApplyFields(prev => ({ ...prev, startDate: e.target.valueAsNumber }))} />
            </div>
            <div className="col">
              <label htmlFor="enddate" className='fw-bolder'>End Date:</label>
            </div>
            <div className="col">
              <input id='enddate' type="date" className='custom-date-container'
                value={new Date(applyFields.endDate).toISOString().substring(0, 10)}
                onChange={(e) => setApplyFields(prev => ({ ...prev, endDate: e.target.valueAsNumber }))} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={async () => {
            await onClick(property.propertyId);
            setApplyModal(false);
          }}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>}
    </div>
  )
}

export default PropertyCard;