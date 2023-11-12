import Image from 'next/image';
import React, { FC, useState } from 'react';
import { Button, Form, FormGroup, Modal } from 'react-bootstrap';
import { useWeb3 } from 'src/contexts/Web3Context';
import { abi } from 'src/contracts';
import { IProperty } from 'src/interface/property.interface';

type IPropertyCard = {
  property: IProperty;
  operation: "Apply" | "Terminate";
}

const PropertyCard: FC<IPropertyCard> = ({ property, operation }) => {
  const { account, contractCreate } = useWeb3();
  const [applyModal, setApplyModal] = useState<boolean>(false);

  const [applyFields, setApplyFields] = useState<{
    startDate: number;
    endDate: number;
  }>({
    startDate: Date.now(),
    endDate: Date.now()
  });


  const handleApply = async () => {
    const contract = await contractCreate(process.env.NEXT_PUBLIC_RENTAL_CONTRACT as string, abi)
    if (contract) {
      const applyAction = await contract.basvuruYap(property.id, applyFields.startDate, applyFields.endDate);
      await applyAction.wait();
    }
  };

  const handleTerminate = async () => {
    const contract = await contractCreate(process.env.NEXT_PUBLIC_RENTAL_CONTRACT as string, abi)
    if (contract) {
      const terminateAction = await contract.sozlesmeyiSonlandir();
      await terminateAction.wait();
    }
  };

  return (
    <div className='property-card-container'>
      <Image src={`/samples/${property.type === 'Store' ? 'store.png' : 'home.png'}`} alt='property-img' width={200} height={200} />
      <h3>
        <span className='text-muted'>Type: </span>{property.type}
      </h3>
      <h5>
        <span className='text-muted'>Amount: </span>{property.amount}
      </h5>

      <Button
        onClick={() => operation === "Apply"
          ? setApplyModal(true)
          : operation === "Terminate"
            ? handleTerminate()
            : {}}
        disabled={(operation === "Apply" && property.owner?.toLocaleLowerCase() === account?.toLocaleLowerCase())
          ? true : false}>
        {(operation === "Apply" && property.owner?.toLocaleLowerCase() === account?.toLocaleLowerCase())
          ? 'Already Your Property'
          : operation}
      </Button>


      <Modal show={applyModal} onHide={() => setApplyModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Post Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormGroup>
              <input type="date" name="" id="" />
              {/* <DatePicker
              // value={this.state.value}
              // onChange={handleChange}
              /> */}
            </FormGroup>
            <FormGroup>
              <input type="date" name="" id="" />
              {/* <DatePicker
              // value={this.state.value}
              // onChange={handleChange}
              /> */}
            </FormGroup>
            {/* <Form.Group className="mb-3" controlId="address">
              <Form.Control
                type="text"
                placeholder="Address"
                value={createFields.address}
                onChange={(e) => setCreateFields(prev => ({ ...prev, address: e.target.value }))} />
            </Form.Group>
            <Form.Select className="mb-3"
              aria-label="Select property type"
              value={createFields.type}
              onChange={(e) => setCreateFields(prev => ({ ...prev, type: e.target.value }))}>
              <option value="" disabled>Select property type</option>
              <option value="Home">Home</option>
              <option value="Store">Store</option>
            </Form.Select>
            <Form.Group className="mb-3" controlId="amount">
              <Form.Control
                type="number"
                placeholder="Amount"
                value={createFields.amount}
                onChange={(e) => setCreateFields(prev => ({ ...prev, amount: Number(e.target.value) }))} />
            </Form.Group> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleApply}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default PropertyCard;