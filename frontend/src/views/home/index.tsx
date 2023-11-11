import { Tab, Tabs } from 'react-bootstrap';
import Header from 'src/components/header';
import PropertyCard from 'src/components/property-card';
import { useWeb3 } from 'src/contexts/Web3Context';

export default function Home() {
  const { account } = useWeb3();

  return (
    <div className='container p-3'>
      <Header />
      <main>
        <Tabs defaultActiveKey="properties" className="mb-3">
          <Tab eventKey="properties" title="Home">
            <PropertyCard type='Home' amount={50} />
          </Tab>
          <Tab eventKey="profile" title="Profile" disabled={!account}>
            Tab content for Profile
          </Tab>
        </Tabs>
      </main>
    </div>
  )
}
