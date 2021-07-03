// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;


contract crowdFundFactory {

    address[] public deployedCrowdFundCampaigns;

    constructor(uint minimumContribution){

        address crowdFundCampaign = address(new crowdFund(minimumContribution, msg.sender));
        deployedCrowdFundCampaigns.push(crowdFundCampaign);
    }

    function getDeployedCrowdFundingCampaigns() public view returns (address[] memory) {
        return deployedCrowdFundCampaigns;
    }


}

contract crowdFund {
    
    struct Request {
        
        string requestDescription;
        address recipient;
        uint amount;
        uint approvalCount;
        bool completed;
        mapping(address => bool) requestApprovers;
    }
        
    
    mapping(uint => Request) public withrawalRequests;
        
    uint withrawRequestCount = 0;
    
    address public entrepreneur;
    
    struct contributorInfo {
        bool contributed;
        bool approved;
        
    }
    
    mapping(address => contributorInfo)  public contributors;
    uint public minimumContribution;
    uint public contributorsCount;
    
    
    constructor (uint minimumContri, address initiator){
        entrepreneur = initiator;
        minimumContribution = minimumContri;
    }
    
    
    function contributeToBusiness() public payable {
        
        require(msg.value >= minimumContribution);
        contributors[msg.sender].contributed = true;
        contributorsCount++;
        
    }
    
    function initiateRequest(string memory description, uint amount, address vendor) public onlyEntrepreneur {
        
        Request storage request =  withrawalRequests[withrawRequestCount++];
        request.requestDescription=description;
        request.recipient=vendor;
        request.amount=amount;
        request.completed=false;
        request.approvalCount=0;
        
        
    }
    
    function approveWithrawalRequests(uint requestNumber) public {
        
        require(msg.sender != entrepreneur);
        require(contributors[msg.sender].contributed);
        require(!contributors[msg.sender].approved);
        require(!withrawalRequests[requestNumber].completed);
        
        Request storage request = withrawalRequests[requestNumber];
        request.requestApprovers[msg.sender] = true;
        request.approvalCount++;
        contributors[msg.sender].approved = true;
        
    }
    
    function withrawFunds(uint requestNumber) public onlyEntrepreneur{
        
        require(withrawalRequests[requestNumber].approvalCount > contributorsCount/2);
        
        Request storage request = withrawalRequests[requestNumber];
        payable(request.recipient).transfer(request.amount);
        request.completed = true;
        
    }
    
    function getTotalFund() public view returns (uint balance){
        return address(this).balance;
    }
    
    modifier onlyEntrepreneur{
        require(msg.sender == entrepreneur);
        _;
    }
    
    
    
}