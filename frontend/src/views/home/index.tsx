import { useCallback, useEffect, useState } from 'react';
import { Button, Form, Modal, Tab, Tabs } from 'react-bootstrap';
import Header from 'src/components/header';
import PropertyCard from 'src/components/property-card';
import { useWeb3 } from 'src/contexts/Web3Context';
import { abi } from 'src/contracts';
import { IProperty } from 'src/interface/property.interface';

export default function Home() {
  const { account, contractCreate } = useWeb3();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [propertyList, setPropertyList] = useState<Array<IProperty>>([]);
  const [myProperties, setMyProperties] = useState<IProperty | null>(null);

  const [createFields, setCreateFields] = useState<{
    address: string;
    type: string;
    amount: number;
  }>({
    address: "",
    type: "",
    amount: 0,
  })

  const handleGetPropertyList = useCallback(async () => {
    const contract = await contractCreate(process.env.NEXT_PUBLIC_RENTAL_CONTRACT as string, abi)
    if (contract) {
      const propertyListAction = await contract.ilanlariListele()
        .then(res => res)
        .catch(err => console.error("ilanlariListele err: ", err));
      setPropertyList(propertyListAction.map((elm: any, index: number) => ({
        id: index,
        owner: elm[0],
        address: elm[1],
        type: elm[2],
        amount: Number(elm[3]),
        status: elm[4],
        tenant: elm[5],
      })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetMyProperties = useCallback(async () => {
    const contract = await contractCreate(process.env.NEXT_PUBLIC_RENTAL_CONTRACT as string, abi)
    if (contract) {
      const tenantProperty = await contract.kiraciMulk(account);
      // console.log("tenantProperty: ", tenantProperty);
      setMyProperties(tenantProperty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleGetPropertyList();
    handleGetMyProperties();
  }, [handleGetMyProperties, handleGetPropertyList]);

  const handlePostAd = async () => {
    const contract = await contractCreate(process.env.NEXT_PUBLIC_RENTAL_CONTRACT as string, abi);
    if (contract) {
      const createAction = await contract.ilanAc(createFields.address, createFields.type, createFields.amount).then(res => res).catch(err => console.error("ilanAc err: ", err));
      await createAction.wait();
      handleGetPropertyList();
      setShowModal(false);
    }
  }

  return (
    <div className='container p-3'>
      <Header />
      <div className='main'>
        <Tabs defaultActiveKey="properties" className="mb-3">
          <Tab eventKey="properties" title="Home">
            <div className="row">
              {propertyList.map((property, index) => (
                <div className="col" key={index}>
                  <PropertyCard property={property} operation="Apply" />
                </div>
              ))}
            </div>
          </Tab>
          <Tab eventKey="profile" title="Profile" disabled={!account}>
            <div className="row w-100">
              <div className="col-12 text-end">
                <Button onClick={() => setShowModal(true)}>Post a ad</Button>
              </div>
              {/* {myProperties.map((property, index) => (
                  <div className="col" key={index}>
                    <PropertyCard property={property} />
                  </div>
                ))} */}
              <div className="col">
                <PropertyCard property={{
                  type: "Store",
                  amount: 50
                }} operation="Terminate" />
              </div>
              <div className="col">
                <PropertyCard property={{
                  type: "Home",
                  amount: 50
                }} operation="Terminate" />
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Post Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="address">
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
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handlePostAd}
            disabled={!createFields.address || createFields.amount < 1 || !createFields.type}>
            Create Property Ad
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
