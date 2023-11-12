import { useCallback, useEffect, useState } from 'react';
import { Button, Form, Modal, Tab, Tabs } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Header from 'src/components/header';
import Loader from 'src/components/loader';
import PropertyCard from 'src/components/property-card';
import { useWeb3 } from 'src/contexts/Web3Context';
import { IProperty } from 'src/interface/property.interface';

export default function Home() {
  const { account, contractCreate } = useWeb3();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allPropertyList, setAllPropertyList] = useState<Array<IProperty>>([]);

  const [createFields, setCreateFields] = useState<{
    address: string;
    type: string;
    amount: number;
  }>({
    address: "",
    type: "",
    amount: 0,
  });
  const [applyFields, setApplyFields] = useState<{
    startDate: number;
    endDate: number;
  }>({
    startDate: Date.now(),
    endDate: Date.now(),
  });

  const handleGetAllProperties = useCallback(async () => {
    const contract = await contractCreate();
    if (contract) {
      await contract.allPropertyList()
        .then((res: any) => {
          setAllPropertyList(res.map((property: any) => ({
            propertyId: Number(property[0]),
            owner: property[1],
            address: property[2],
            type: property[3],
            amount: Number(property[4]),
            isRented: property[5],
            tenant: property[6],
            startDate: Number(property[7]),
            endDate: Number(property[8]),
          })));
        })
        .catch((err: any) => console.error("allPropertyList err: ", err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleGetAllProperties();
  }, [handleGetAllProperties]);

  const handlePostAd = async () => {
    setIsLoading(true);
    const contract = await contractCreate();
    if (contract) {
      await contract.postAnAd(createFields.address, createFields.type, createFields.amount).then((res: any) => res.wait()).catch((err: any) =>
        toast.error(err.reason, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }));
      handleGetAllProperties();
      window.location.reload();
    }
    setIsLoading(false);
  }

  const handleApply = async (propertyId: number) => {
    setIsLoading(true);
    const contract = await contractCreate();
    if (contract) {
      await contract.applyToProperty(propertyId, applyFields.startDate, applyFields.endDate).then((res: any) => res.wait()).catch((err: any) =>
        toast.error(err.reason, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }));
      handleGetAllProperties();
    }
    setIsLoading(false);
  };

  const handleTerminate = async (properyId: number) => {
    setIsLoading(true);
    const contract = await contractCreate();
    if (contract) {
      await contract.terminateToProperty(properyId).then((res: any) => res.wait()).catch((err: any) =>
        toast.error(err.reason, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
      );
      handleGetAllProperties();
    }
    setIsLoading(false);
  };

  const handleApprove = async (propertyId: number) => {
    setIsLoading(true);
    const contract = await contractCreate();
    if (contract) {
      await contract.approveRental(propertyId).then((res: any) => res.wait()).catch((err: any) =>
        toast.error(err.reason, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }));
      handleGetAllProperties();
    }
    setIsLoading(false);
  }

  const handleDeny = async (propertyId: number) => {
    setIsLoading(true);
    const contract = await contractCreate();
    if (contract) {
      await contract.denyRental(propertyId).then((res: any) => res.wait()).catch((err: any) =>
        toast.error(err.reason, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }));
      handleGetAllProperties();
    }
    setIsLoading(false);
  }

  return (
    <div className='container p-3'>
      <Header />
      <div className='main'>
        {isLoading && <Loader />}
        <Tabs defaultActiveKey="properties" className="mb-3">
          <Tab eventKey="properties" title="Home">
            <div className="row">
              {allPropertyList.map((property, index) => (
                <div className="col" key={index}>
                  <PropertyCard property={property} operation="Apply" setIsLoading={setIsLoading} onClick={handleApply} applyFields={applyFields} setApplyFields={setApplyFields} />
                </div>
              ))}
            </div>
          </Tab>
          <Tab eventKey="profile" title="Profile" disabled={!account}>
            <div className="row">
              <div className="col-12 text-end">
                <Button onClick={() => setShowModal(true)}>Yeni İlan</Button>
              </div>
              <div className="col-12">
                <h5 className='text-primary text-center'>Kiraladığım Mülkler</h5>
              </div>
              {allPropertyList.filter(property => property.tenant.toLowerCase() === account?.toLowerCase() && property.isRented).map((property, index) => (
                <div className="col-auto" key={index}>
                  <PropertyCard property={property} operation="Terminate" setIsLoading={setIsLoading} onClick={handleTerminate} />
                </div>
              ))}
              <div className="col-12 mt-5">
                <h5 className='text-primary text-center'>Kiralanan Mülklerim</h5>
              </div>
              {allPropertyList.filter(property => property.owner.toLowerCase() === account?.toLowerCase() && property.isRented).map((property, index) => (
                <div className="col-auto" key={index}>
                  <PropertyCard property={property} operation={undefined} setIsLoading={setIsLoading} onClick={() => { }} />
                </div>
              ))}
              <div className="col-12 mt-5">
                <h5 className='text-primary text-center'>Onay Bekleyen Mülkler</h5>
              </div>
              {allPropertyList.filter(property => property.owner.toLowerCase() === account?.toLowerCase() && property.tenant !== "0x0000000000000000000000000000000000000000" && property.startDate > 0 && property.endDate > 0 && !property.isRented).map((property, index) => (
                <div className="col-auto" key={index}>
                  <PropertyCard property={property} operation="Approve" setIsLoading={setIsLoading} onClick={handleApprove} handleDeny={handleDeny} />
                </div>
              ))}
            </div>
          </Tab>
        </Tabs>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size='sm' centered>
        <Modal.Header closeButton>
          <Modal.Title>Yeni İlan</Modal.Title>
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
