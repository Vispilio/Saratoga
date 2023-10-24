import { useState, useEffect } from "react"
import { Link } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// // import Confetti from "react-confetti";
const Home = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHideShow, setIsHideShow] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);
    const [amount, setAmount] = useState(0.05);
    // const [senderAddress, SetSenderAddress] = useState('0xEcD227b51328FAba79c951DA9F5E582387B7f89f')
    const [receiverAddress, SetRecieverAddress] = useState('0xEcD227b51328FAba79c951DA9F5E582387B7f89f')
    // const [submitted, setSubmitted] = useState(false);
    const [ walletAccount, setWalletAccount ] = useState('')
    const [ currentChain, setCurrentChain ] = useState('')
    const [ isConnected, setIsConnected ] = useState(false)
    const [price, setPrice] = useState(0);
    const handleSubmit = async(e) => {
        e.preventDefault();
        const gasPrice = '0x5208' // 21000 Gas Price
        const amountHex = (amount * Math.pow(10,18)).toString(16)
        if(amount<0.05){
            alert('Amount should more than 0.05');
        }
        if(walletAccount===''){
            alert('Connect Wallet');
        }
        if(amount>=0.05&&walletAccount!==''){
            const tx = {
              from: walletAccount,
              to: receiverAddress,
              value: amountHex,
              gas: gasPrice,
            }
        console.log("amount"+amount);

            try{await window.ethereum.request({ method: 'eth_sendTransaction', params: [ tx ]})
            }catch (error) {
                console.error('Error connecting wallet:', error);
            }
        }
        // setSubmitted(true);
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
        // setSubmitted(false);
        setAmount(0.05);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        // setSubmitted(false);
    }
    const changeModalIndex = (num) => {
        setModalIndex(num);
    }
    const handleHideShow = () => {
        if(isHideShow==false){
            setIsHideShow(true);
        }
        if(isHideShow==true){
            setIsHideShow(false);
        }
    }

    const handleConnectOnce = async () => {
        try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            // if (chainId !== '0x1') {
            //   alert('Please switch to the Ethereum network');
            //   return;
            // }
        
            await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x1' }]
              });
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
            const data = await response.json();
            const ethPrice = data.ethereum.usd;
            setPrice(ethPrice);
            // console.log(ethPrice+"usd")
            // Proceed with further actions using the connected wallet
            console.log('Connected accounts:', accounts);
            setIsConnected(true)
            setWalletAccount(accounts[0])
            console.log("connected "+accounts[0])
          } catch (error) {
            console.error('Error connecting wallet:', error);
          }
            
                
            
        
    }
    const handleDisconnect = async () => {

        console.log('Disconnecting MetaMask...')
        setIsConnected(false)
        setWalletAccount('')
    }
  // Initialize the application and MetaMask Event Handlers
  useEffect(() => {

    // Setup Listen Handlers on MetaMask change events
    if(typeof window.ethereum !== 'undefined') {
        // Add Listener when accounts switch
        window.ethereum.on('accountsChanged', (accounts) => {

          console.log('Account changed: ', accounts[0])
          setWalletAccount(accounts[0])
        
        })        
        // Do something here when Chain changes
        window.ethereum.on('chainChanged', (chaindId) => {
          console.log('Chain ID changed: ', chaindId)
          setCurrentChain(chaindId)
        })
    } else {
        alert('Please install MetaMask to use this service!')
    }
  }, [])

    return (
        <div className="body">
            <div className="topnav fixed w-full top-0">
                <div className='float-left headerLogo p-3 lg:pl-10 lg:pr-32 pr-10 pl-0'>
                    <img className=' pl-5 h-[50px]' src="img/saratoga-logo.png" alt="ad"></img>
                </div>
                <div className='float-right p-7 lg:hidden'>
                    <img onClick={() => {handleOpenModal();changeModalIndex(13); handleHideShow();}} className=' hover:cursor-pointer' src="img/hideshow.png" alt="ad"></img>
                </div>
                <div className="hidden relative  lg:float-right lg:flex lg:block ">
                    <Link to="/" className="link  p-6">HOME</Link>
                    <Link to="https://www.feroxadvisors.com/" className="link  p-6 ">MAIN WEBSITE</Link>
                    <Link to="https://www.feroxadvisors.com/srt" className="link p-6">SRT TOKEN</Link>
                    <div onClick={!isConnected ? handleConnectOnce : handleDisconnect} className="connect-btn m-3 py-3 pl-10 pr-10 mx-12 rounded-xl">
                    {
                        isConnected ? (
                            <div>
                                <div>DISCONNECT</div>
                                <div className="absolute right-0 top-20">{walletAccount}</div>
                            </div>                            
                        ) : (                          
                          <div>CONNECT</div>
                        )
                      }
                    </div>

                </div>


                </div>
                {modalIndex==13 && isHideShow &&(
                
                <div className="pt-20 lg:hidden fixed w-full top-menu">
                    <div className="w-full link text-xl px-6 my-6 text-center flex"><Link to="/" style={{width:"100%"}}>HOME</Link></div>
                    <div className="w-full link text-xl px-6 my-6 text-center flex"><Link to="https://www.feroxadvisors.com/" style={{width:"100%"}}>MAIN WEBSITE</Link></div>
                    <div className="w-full link text-xl px-6 my-6 text-center flex"><Link to="https://www.feroxadvisors.com/srt" style={{width:"100%"}}>SRT TOKEN</Link></div>
                    <div onClick={!isConnected ? handleConnectOnce : handleDisconnect} className="connect-btn m-3 py-3 mx-12 rounded-xl text-center">
                        {
                            isConnected ? (

                                <div>
                                    <div>DISCONNECT</div>
                                    {/* <div className="">{walletAccount}</div> */}
                                </div>

                            ) : (
                            
                              <div>CONNECT</div>

                            )
                        }
                    </div>
                </div>)}
                <img className="fixed top-[75px] lg:w-[520px] w-[360px]" src="img/bluebarry-big1.png"></img>

                <div className="header_description1">

                {isModalOpen &&modalIndex==11 && (
                <div  className="join-modal ">
                    <form className="modal-content animate md:p-10 p-5" onSubmit={handleSubmit}>
                        <div className="text-4xl text-center font-bold pb-[10px]">Seed Round</div>
                        <div className="text-center pb-2">Please enter the amount of ETH  you like to invest below (minimum size is 0.05) and interact with our master contract</div>
                        <hr className=" opacity-30"/>
                        <div className="pt-5 pb-2 text-left">Your Wallet Address</div>
                        <input  className="w-full border-none outline-none" 
                        type="text"
                        placeholder="You should connect wallet"
                        value={walletAccount}
                        disabled={true}
                        />
                        <div className="pt-0 pb-2 text-left">Master Wallet Address</div>
                        <input  className="w-full border-none outline-none" 
                        type="text"
                        value={receiverAddress}
                        disabled={true}
                        />
                        <div className="pb-2 text-left">Amount of Investion</div>
                        <input  className="w-full border-none outline-none" 
                        placeholder="Enter Amount of Investion..."
                        type="number"
                        step="0.01"
                        min="0.05"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        />
                        <hr className=" opacity-30"/>
                        <div className="flex pt-[10px]">
                            <div className="w-2/3 text-left">Price &nbsp; </div>
                            <div className="w-1/3 text-right">{(price*amount).toFixed(4)}</div>
                            <div>&nbsp;USD</div>
                        </div>
                        <div className="flex pb-[10px]">
                            <div className="w-2/3 text-left">SRT Token &nbsp; </div>
                            <div className="w-1/3  text-right">
                            { amount>=0.05&&amount<=0.49&&
                                (
                                    <div>{(price*amount/0.01).toFixed(4)}</div>
                                )
                            }
                            { amount>=0.5&&amount<=2.99&&
                                (
                                    <div>{(price*amount/0.009).toFixed(4)}</div>
                                )
                            }
                            { amount>=3&&
                                (
                                    <div>{(price*amount/0.008).toFixed(4)}</div>
                                )
                            }
                            
                            </div>
                            <div>&nbsp;SRT</div>
                            {/* <div className="w-1/3 text-right">{price*amount}</div> */}
                            
                        </div>
                        <hr className="opacity-30"></hr>
                        <div className="flex">
                        <button type="submit"  className="mx-auto text-center wail-btn text-2xl mt-5 py-3 px-10 rounded-xl">Invest Now</button>
                        </div>
                        {/* <button  className="button hover:cursor-pointer" style={{paddingLeft:"30px", paddingRight:"30px"}}>Submit</button> */}
                        <div className="close" onClick={handleCloseModal}>&times;</div>
                    </form>

                </div>)}
                
                
            </div>
            <div className="header_description">
            <Link to="https://git.io/typing-svg"><img src="https://readme-typing-svg.herokuapp.com/?lines=+Welcome+to+Saratoga!;Longevity, Wellness Technologies ; Smart Farming&font=Pacifico&center=true&&width=1920&height=100&color=F7F7F7FF&vCenter=true&size=60%22"/></Link>

                <div className="flex header">
                    <img className=' lg:w-[230px] w-[150px]' src="img/logo.png" alt="ad"></img>
                    
                </div>
                
                <div className="lg:text-[80px] md:text-5xl text-5xl p-5 font-bold text-center gradient">Join the Land Revolution</div>
                 
                <div className="w-3/4 max-w-[650px] min-w-[350px] pb-[30px] font-bold">    
                    <div className="lg:text-3xl text-xl p-0 text-center text-[#e2e2e2]">Saratoga has launched on Ethereum Network To participate in the Presale rounds, please</div>

                </div>
                <div onClick={() => {handleOpenModal(); changeModalIndex(11) ; handleHideShow()}}  className="wail-btn lg:text-3xl text-2xl font-bold mt-3 mb-3 lg:py-4 py-3 pl-10 pr-5 rounded-xl flex">Invest Now &nbsp;<img className="lg:h-[40px] h-[35px]" src="img/blueberry.png"></img></div>
                <div className="text-center pt-[20px] lg:text-xl">
                    <div className="pb-[10px]">0.05 to 0.49 ETH investment:  1 SRT = 0.01 USD,</div>  
                    <div className="pb-[10px]">0.5 - 2.99 ETH: 1 SRT = 0.009 USD</div>
                    <div>for 3 ETH and above: 1 SRT = 0.008 USD</div>
                </div>
            </div>
            <div>
            
            </div>
            


            
        </div>
    )
}

export default Home