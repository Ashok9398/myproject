const {ethers } = require("hardhat");
const {assert,expect} = require("chai");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

let accounts;
let mytoken;
describe("Charity",()=>{
    beforeEach("Deploys Application",async()=>{
        accounts = await ethers.getSigners();
        Charity = await ethers.getContractFactory("Charity",accounts[0]);
        charity = await Charity.deploy();
        
    })
    it("Checks for deploy address",async()=>{
        console.log(charity.address);
        const admin = await charity.admin();
        expect(admin.adminAddress).to.equal(accounts[0].address);
    })
    it("Checks for the new benefactor ",async()=>{
        await expect( charity.connect(accounts[1]).addNewBenifactor("John","john.doe@gmail.com")).to.emit(charity,"newBenifactorAdded")
        .withArgs("John",accounts[1].address,"john.doe@gmail.com");
        const benifactor = await charity.benifactors(accounts[1].address);
        console.log(benifactor);
        expect(benifactor.benifactorEmail).to.equal("john.doe@gmail.com");
    });
    it("Checks for add new Donor function",async()=>{
        await expect( charity.connect(accounts[2]).addNewDonor("Josh","josh@gmail.com")).to.emit(charity,"newDonorAdded")
        .withArgs("Josh",accounts[2].address,"josh@gmail.com");
        const donors = await charity.donors(accounts[2].address);
        console.log(donors);
        expect(donors.donorEmail).to.equal('josh@gmail.com'); 
    })
    it("Checks for new Project added ",async()=>{
        const  desc = "Add your donations to show your support for the ukraine in this current crisis";
        console.log(await charity.totalProjects());
        await expect(charity.addNewProject("Ukraine Relief",desc,100)).to.emit(charity,"newProjectAdded")
        .withArgs(2,"Ukraine Relief",accounts[0].address,desc,100,false,0,false);
        const project = await charity.charityProjects(2);
        console.log(project.projectDescription);


    })
    it("Checks for approve project function",async()=>{
        const  desc = "Add your donations to show your support for the ukraine in this current crisis";
        
        charity.addNewProject("Ukraine Relief",desc,100);
        var project = await charity.charityProjects(2);
        expect (project.isApproved).to.equal(false);
        await expect(charity.approvProject(2)).emit(charity,"projectApproved")
        .withArgs(2,"Ukraine Relief",accounts[0].address,desc,100,false,0,true);
        project = await charity.charityProjects(2);
        expect (project.isApproved).to.equal(true);     
    
        
    })
    it("Checks for donate Ether function",async()=>{
        const options = {value: ethers.utils.parseEther("1.0")};
        const  desc = "Add your donations to show your support for the ukraine in this current crisis";
        
        charity.addNewProject("Ukraine Relief",desc,100);
        var project = await charity.charityProjects(2);
        expect(project.amountGot).to.equal(0);
        await charity.donateEther(accounts[0].address,2,options);
        project = await charity.charityProjects(2);
        //console.log(project.amountGot);
        expect(project.amountGot).to.equal(ethers.utils.parseEther("1.0"));
    });
    
})