// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RentalContract {
    uint256 private propertyCount = 0;

    struct Property {
        uint256 propertyId;
        address owner;
        string propertyAddress;
        string propertyType; // Home or Store
        uint256 rentalFee;
        bool isRented;
        address tenant;
        uint256 startDate;
        uint256 endDate;
    }

    Property[] public properties;

    event AddedProperty(
        address indexed owner,
        uint256 propertyId,
        string propertyAddress,
        string propertyType,
        uint256 rentalFee
    );
    event AppliedProperty(
        address indexed tenant,
        uint256 propertyId,
        uint256 startDate,
        uint256 endDate
    );
    event DeniedProperty(address indexed tenant, uint256 propertyId);
    event ApprovedProperty(
        address indexed owner,
        uint256 propertyId,
        address indexed tenant
    );
    event SozlesmeSonlandirildi(address indexed tenant, uint256 propertyId);

    function postAnAd(
        string memory _propertyAddress,
        string memory _propertyType,
        uint256 _rentalFee
    ) public {
        Property memory newProperty = Property({
            propertyId: propertyCount,
            owner: msg.sender,
            propertyAddress: _propertyAddress,
            propertyType: _propertyType,
            rentalFee: _rentalFee,
            isRented: false,
            tenant: address(0),
            startDate: 0,
            endDate: 0
        });
        properties.push(newProperty);
        propertyCount++;
        emit AddedProperty(
            msg.sender,
            properties.length - 1,
            _propertyAddress,
            _propertyType,
            _rentalFee
        );
    }

    function allPropertyList() public view returns (Property[] memory) {
        return properties;
    }

    function applyToProperty(
        uint256 _propertyId,
        uint256 _startDate,
        uint256 _endDate
    ) public {
        require(_propertyId < properties.length, "Gecersiz mulk ID.");
        Property storage property = properties[_propertyId];
        require(property.isRented == false, "Bu mulk zaten kiralandi.");
        require(property.owner != msg.sender, "Kendi mulkunu kiralayamazsin.");
        require(
            _startDate < _endDate,
            "Baslangic tarihi bitis tarihinden once olmalidir."
        );
        property.tenant = msg.sender;
        property.startDate = _startDate;
        property.endDate = _endDate;
        emit AppliedProperty(msg.sender, _propertyId, _startDate, _endDate);
    }

    function approveRental(uint256 _propertyId) public {
        require(_propertyId < properties.length, "Gecersiz mulk ID.");
        Property storage property = properties[_propertyId];
        require(
            property.owner == msg.sender,
            "Sadece mulk sahibi kiralamayi onaylayabilir."
        );
        require(!property.isRented, "Bu mulk zaten onaylanmis.");
        property.isRented = true;
        emit ApprovedProperty(msg.sender, _propertyId, property.tenant);
    }

    function denyRental(uint256 _propertyId) public {
        require(_propertyId < properties.length, "Gecersiz mulk ID.");
        Property storage property = properties[_propertyId];
        require(
            property.owner == msg.sender,
            "Sadece mulk sahibi kiralamayi reddedebilir."
        );
        require(!property.isRented, "Bu mulk zaten onaylanmis.");
        property.isRented = false;
        property.tenant = address(0);
        property.startDate = 0;
        property.endDate = 0;
        emit DeniedProperty(msg.sender, _propertyId);
    }

    function terminateToProperty(uint256 _propertyId) public {
        Property storage property = properties[_propertyId];
        require(
            property.tenant == msg.sender,
            "Bu mulkun kiracisi degilsiniz."
        );
        // require(
        //     block.timestamp + 15 days >= property.endDate,
        //     "Sozlezme henuz sona ermedi."
        // );
        property.isRented = false;
        property.tenant = address(0);
        property.startDate = 0;
        property.endDate = 0;
        emit SozlesmeSonlandirildi(msg.sender, property.propertyId);
    }
}
