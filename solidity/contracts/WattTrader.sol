// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./WattEnergyToken.sol";

contract WattTrader {
    struct EnergyListing {
        address producer;
        uint256 amount;
        uint256 price;
        bool isActive;
        uint256 listingId;
    }
    struct ConsumerEnergyOverview {
        uint256 energyBalance;
        uint256 energyProduced;
        uint256 energyPurchased;
        uint256 energyConsumed;
    }

    address meteringOracle;

    EnergyListing[] public energyListings;

    WattEnergyToken public immutable energyToken;

    mapping(address => uint256) public energyProduced;
    mapping(address => uint256) public energyPurchased;
    mapping(address => uint256) public energyConsumed;

    uint256 public nextListingId;

    event EnergyListed(
        address indexed producer,
        uint256 indexed listingId,
        uint256 amount,
        uint256 price
    );
    event EnergyPurchased(
        address indexed buyer,
        address indexed seller,
        uint256 indexed listingId,
        uint256 amount,
        uint256 price
    );

    constructor(address _energyToken, address _meteringOracle) {
        energyToken = WattEnergyToken(_energyToken);
        meteringOracle = _meteringOracle;
    }

    // Function to list energy for sale
    function listEnergy(uint256 _amount, uint256 _price) external {
        require(_amount > 0, "Amount must be greater than zero");
        require(
            energyToken.balanceOf(msg.sender) >= _amount,
            "Insufficient energy balance"
        );

        uint256 listingId = nextListingId++;
        EnergyListing memory enerygyListing = EnergyListing(
            msg.sender,
            _amount,
            _price,
            true,
            listingId
        );
        energyListings.push(enerygyListing);

        energyToken.transferFrom(msg.sender, address(this), _amount);

        emit EnergyListed(msg.sender, listingId, _amount, _price);
    }

    // Function to purchase energy
    function purchaseEnergy(uint256 _listingId) external payable {
        EnergyListing storage listing = energyListings[_listingId];
        require(listing.isActive, "Energy listing is not active");
        require(msg.value >= listing.price, "Insufficient payment");

        uint256 payment = listing.price;
        uint256 amount = listing.amount;
        address seller = listing.producer;

        payable(seller).transfer(payment);
        energyToken.transfer(msg.sender, amount);

        energyProduced[seller] += amount;
        energyPurchased[msg.sender] += amount;
        listing.isActive = false;

        emit EnergyPurchased(msg.sender, seller, _listingId, amount, payment);
    }

    function getEnergyListings()
        external
        view
        returns (EnergyListing[] memory)
    {
        return energyListings;
    }

    function getEnergyOverview(
        address consumer
    ) external view returns (ConsumerEnergyOverview memory) {
        uint256 energyBalance = energyToken.balanceOf(consumer);

        uint256 _energyProduced = energyProduced[consumer];

        uint256 _energyPurchased = energyPurchased[consumer];

        uint256 _energyConsumed = energyConsumed[consumer];

        return
            ConsumerEnergyOverview(
                energyBalance,
                _energyProduced,
                _energyPurchased,
                _energyConsumed
            );
    }

    // TODO: use actual oracle
    function reportEnergyConsumption(
        address consumer,
        uint256 consumption
    ) external {
        require(
            msg.sender == meteringOracle,
            "Only authorized oracle report consumption"
        );

        energyToken.burn(consumer, consumption);

        energyConsumed[consumer] += consumption;
    }
}
