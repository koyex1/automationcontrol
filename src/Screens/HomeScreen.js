import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { startJenkinsActions } from '../Actions/JenkinsActions';
import { runActions, stopActions, failActions, successActions } from '../Actions/RunActions';
import { gitPullAction, gitPushAction, gitPushOKAction } from '../Actions/GitActions';
import { emptyValidator } from '../Validator/validator';
import { Textarea, Input, Button, useDisclosure, Stack, Tabs, TabList, TabPanels, Spinner, TabPanel, Tab, ModalOverlay, Modal, ModalContent, ModalBody, ModalCloseButton, ModalHeader, ModalFooter } from '@chakra-ui/react'
import { ArrowDownIcon, ArrowUpIcon, CheckCircleIcon, CheckIcon, SmallCloseIcon } from '@chakra-ui/icons'
import allureimage from '../images/allureimage.png'
import screenshotimage from '../images/screenshot.png'
import htmlimage from '../images/htmlimage.png'
import logreportimage from '../images/logreportimage.png'
import { Link } from 'react-router-dom';
import axios from "axios";
import { SPRING_LOCALHOST } from "../Constants/constants";
//import { Client } from '@stomp/stompjs';
import SockJsClient from 'react-stomp';
//import SockJS from 'sockjs-client';
//import Stomp from 'stompjs';
const customHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:8083'
    //'withCredentials': false,
    //'credentials': 'omit',
    //"Access-Control-Allow-Credentials": "false", 
};

const SOCKET_URL = 'http://localhost:8083/ws-log';






function HomeScreen(props) {
    let runClicked = useSelector(state => state.runClicked);
    let { running, runMessage } = runClicked;
    let stopClicked = useSelector(state => state.stopClicked);
    let fail = useSelector(state => state.fail);
    let success = useSelector(state => state.success);
    let [runState, setRunState] = useState()
    let [featureKey, setFeatureKey] = useState()
    let [message, setMessage] = useState()
    let [resetPull, setResetPull] = useState(false)
    let [pushOpen, setPushOpen] = useState(false)
    let [pullOpen, setPullOpen] = useState(false)
    let [pushOKOpen, setPushOKOpen] = useState(false)
    let [runOpen, setRunOpen] = useState(false)
    let [validatorOpen, setValidatorOpen] = useState(false)
    let [openRunNoExist, setOpenRunNoExist] = useState(true)
    let [e2ETextArea, setE2ETextArea] = useState("")
    let [envDSTextArea, setEnvDSTextArea] = useState("")
    let dispatch = useDispatch()
    let startJenkins = useSelector(state => state.startJenkins);
    let gitPull = useSelector(state => state.gitPull);
    let { pullMessage, e2eContent, envDSContent } = gitPull
    let gitPush = useSelector(state => state.gitPush);
    let { pushMessage, action, e2esha, envsha, noOK } = gitPush
    let gitPushOK = useSelector(state => state.gitPushOK);
    let { pushOKMessage } = gitPushOK
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [logMessage, setLogMessage] = useState([]);
    const [connCount, setConnCount] = useState([]);
    const [passStatus, setPassStatus] = useState(false);
    const [failStatus, setFailStatus] = useState(false);
    const [showStop, setShowStop] = useState(false);
    const messagesEndRef = useRef(null)




    let onConnected = () => {
        console.log("Connected!!")
        try {

            fetch(`${SPRING_LOCALHOST}/start/${featureKey}`, {
                method: "GET",
                // credentials: 'include'
            });//
            //setConnCount(prevActiveStep => prevActiveStep + 1)
            //axios.get(`${SPRING_LOCALHOST}/start/E2eBoard`//, {
            //    headers: {
            //  'Access-Control-Allow-Origin': 'http://localhost:8083',
            //     'Content-Type': 'application/json',
            //},
            //withCredentials: false
            //}

            //  );
        }
        catch (error) {
            console.log(error.message)
        }
    }
    const scrollToBottom = ()=>{
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }

    let onMessageReceived = (msg) => {
        console.log("message received");
        console.log(msg)
        if (msg.some(x => x == "Failed")) {
            setFailStatus(true)
            dispatch(failActions())
        }
        if (msg.some(x => x == "Passed")) {
            setPassStatus(true)
            dispatch(successActions())

        }

        if (msg.length > 0) {
            setLogMessage(msg);
            scrollToBottom()
        }
        console.log(msg)
    }


    useEffect(() => {


    }, [])








    useEffect(() => {

    }, [message, pushMessage])

    useEffect(() => {
        setE2ETextArea(e2eContent)
        setEnvDSTextArea(envDSContent)
        setResetPull(false)

    }, [e2eContent, resetPull, envDSContent])


    let handleE2ETextArea = (e) => {
        let inputValue = e.target.value
        setE2ETextArea(inputValue)
    }

    let handleEnvDsTextArea = (e) => {
        let inputValue = e.target.value
        setEnvDSTextArea(inputValue)
    }

    let handleFeatureKey = (e) => {
        let inputValue = e.target.value
        setFeatureKey(inputValue)
    }

    let handleStartJenkins = () => {
        dispatch(startJenkinsActions(featureKey))
    }
    let handleGitPull = () => {
        if (emptyValidator(featureKey)) {
            setMessage("Feature Key has not been provided")
            setPushOpen(false)
            setPullOpen(false)
            setRunOpen(false)
            setValidatorOpen(true)
            setPushOKOpen(false)
            onOpen()
            return;
        }
        else {
            dispatch(gitPullAction(featureKey))
            setResetPull(true);
            setPushOpen(false)
            setRunOpen(false)
            setPullOpen(true)
            setValidatorOpen(false)
            setPushOKOpen(false)
            onOpen()
        }
    }
    let handleGitPush = () => {
        if (emptyValidator(featureKey)) {
            setMessage("Feature Key has not been provided")
            setPushOpen(false)
            setPullOpen(false)
            setRunOpen(false)
            setValidatorOpen(true)
            setPushOKOpen(false)
            onOpen()
            return;
        }
        else {
            dispatch(gitPushAction(featureKey, unescape(encodeURIComponent(e2ETextArea)), envDSTextArea))
            setPushOpen(true)
            setPullOpen(false)
            setValidatorOpen(false)
            setPushOKOpen(false)
            setRunOpen(false)
            onOpen()
        }
    }

    let handleOkPush = () => {
        onClose()
        dispatch(gitPushOKAction(featureKey, unescape(encodeURIComponent(e2ETextArea)), envDSTextArea, action, e2esha, envsha))
        setPushOpen(true)
        setPullOpen(false)
        setValidatorOpen(false)
        setPushOKOpen(true)
        setRunOpen(false)
    }
    let handleStop = () => {
        dispatch(stopActions(featureKey))

        //setRunState(stopClicked.running);
    }

    useEffect(() => {
        setRunState(stopClicked.running);

    }, [stopClicked.running])
    useEffect(() => {
        setRunState(runClicked.running);
    }, [runClicked.running])

    useEffect(() => {
        setRunState(fail.running);
    }, [fail.running])
    useEffect(() => {
        setRunState(success.running);
    }, [success.running])



    let handleRun = () => {
        if (emptyValidator(featureKey)) {
            setMessage("Feature Key has not been provided")
            setPushOpen(false)
            setPullOpen(false)
            setValidatorOpen(true)
            setPushOKOpen(false)
            setRunOpen(false)
            onOpen()
            return;
        }
        else {
            dispatch(runActions(featureKey))
            setLogMessage([])
            setFailStatus(false)
            setPassStatus(false)
            setPushOpen(false)
            setPullOpen(false)
            setValidatorOpen(false)
            setPushOKOpen(false)
            setRunOpen(true)
            setOpenRunNoExist(false);


            //setRunState(runClicked.running)

        }
    }

    useEffect(() => {
        setOpenRunNoExist(true);
        console.log("baddest")
        console.log(runClicked.runMessage)
        if (runClicked.runMessage != null) {
            onOpen()
        }
    }, [runClicked.runMessage, openRunNoExist])



    let handleCancelPush = () => {
        onClose()
        setMessage("")

    }
    let handleAllureTab = () => {
        console.log("url in")
        window.open('http://localhost:8080/job/AutomationTest/allure', '_blank')

    }

    let handlescreenshot = () => {
        console.log("url in")
        window.open('/failedImage', '_blank')

    }
    let handleHtmlTab = () => {
        window.open('/failedHtmlCode', '_blank')
    }
    let handleLogTab = () => {
        window.open('/logReport', '_blank')
    }
    return (
        <>
            <SockJsClient
                url={SOCKET_URL}
                topics={['/topic/log']}
                onConnect={onConnected}
                onDisconnect={console.log("Disconnected!")}
                onMessage={msg => onMessageReceived(msg)}
                debug={false}
                headers={customHeaders}
            />

            {(pullOpen || validatorOpen || runOpen || pushOpen || pushOKOpen) && <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {(pullOpen && pullMessage) || (runOpen && runMessage) || (validatorOpen && message) || (pushOpen && pushMessage) || (pushOKOpen && pushOKMessage)}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleCancelPush}>
                            Cancel
                        </Button>
                        {(pushOpen || noOK) && <Button onClick={handleOkPush} variant='ghost'>Ok</Button>}
                    </ModalFooter>
                </ModalContent>
            </Modal>}
            <div className='mainPanel'>
                <div className="editorPanel panelPadding">
                    <div className="Header">
                        <h1>AUTOMATION EDITOR</h1>
                    </div>

                    <Tabs h="90%" variant='soft-rounded' colorScheme='green'>

                        <TabList>
                            <Tab>E2E Editor</Tab>
                            <Tab>EnvDS Editor</Tab>
                        </TabList>

                        <TabPanels h="100%">
                            <TabPanel h="100%">
                                <div className="textAreaContainer">
                                    <Textarea
                                        value={e2ETextArea}
                                        onChange={handleE2ETextArea}
                                        fontSize='xl'
                                        color='red.100'
                                        fontWeight='bold'
                                        size='lg'
                                        h="100%"
                                    />

                                </div>



                            </TabPanel>
                            <TabPanel h="100%">
                                <div className="textAreaContainer" >
                                    <Textarea
                                        value={envDSTextArea}
                                        onChange={handleEnvDsTextArea}
                                        fontSize='xl'
                                        color='blue.500'
                                        fontWeight='bold'
                                        size='lg'
                                        h="100%"
                                    />

                                </div>
                            </TabPanel>
                        </TabPanels>

                    </Tabs>
                </div>


                <div className="consoleSetupPanel ">

                    <div className="Header setupPanel panelPadding consoleSetupHeader" >
                        <h1>SETUP</h1>
                        <div>
                            <div className="Header" >
                                <p>PUSH/PULL/RUN FROM GITHUB</p>
                                <div className='setupRows'>
                                    <div>
                                        <Input htmlSize={4}
                                            onChange={handleFeatureKey}
                                            color='white'
                                            width='60'
                                            fontSize='xl'
                                            fontWeight='bold'
                                            size='lg'
                                            h="100%" />
                                    </div>
                                    <div className='pullPushWrapper'>
                                        <Stack direction='row' spacing={4}>
                                            <Button leftIcon={<ArrowDownIcon />} onClick={handleGitPull} colorScheme='pink' variant='solid'>
                                                PULL
                                            </Button>
                                            <Button rightIcon={<ArrowUpIcon />} onClick={handleGitPush} colorScheme='blue' variant='outline'>
                                                PUSH
                                            </Button>
                                        </Stack>
                                    </div>
                                </div>
                                <div className='setupRows'>

                                    <div className='setupRows2'>
                                        <Stack direction='row' spacing={4}>
                                            <Button isDisabled={true} colorScheme='pink' variant='solid'>
                                                RUN
                                            </Button>
                                        </Stack>
                                        <h1> AWS</h1>
                                    </div>
                                </div>

                                <div className='setupRows'>

                                    <div className='setupRows2'>
                                        {(runState != "run") && <Stack direction='row' spacing={4}>
                                            <Button onClick={handleRun} colorScheme='pink' variant='solid'>
                                                RUN
                                            </Button>
                                        </Stack>}
                                        {(runState == "run") && <Stack direction='row' spacing={4}>
                                            <Button onClick={handleStop} colorScheme='red' variant='solid'>
                                                STOP
                                            </Button>
                                        </Stack>}
                                      
                                        <h1> Local</h1>
                                        {(runState == "run") && <Spinner  justifyContent="bottom" width='20px' height='20px' marginLeft={5} thickness='4px' color='blue.500' />}
                                        {passStatus &&  <CheckIcon width='25px' height='25px' alignItems="center"  paddingLeft='5px' color='green.500' />}
                                        {failStatus && <SmallCloseIcon width='30px' height='30px' alignItems="center"  paddingLeft='5px' color='red.500' />}


                                    </div>
                                </div>

                            </div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div className="Header panelPadding consoleHeader" >
                        <h1>CONSOLE</h1>
                        <div className="reportsRow">
                            {(passStatus || failStatus) &&
                                <>
                                    <div onClick={handleAllureTab} ><img src={allureimage} /></div>
                                    <div onClick={handleLogTab}><img src={logreportimage} /> </div>
                                </>
                            }
                            {failStatus &&
                                <>
                                    <div onClick={handlescreenshot} ><img src={screenshotimage} /></div>
                                    <div onClick={handleHtmlTab} ><img src={htmlimage} /> </div>
                                </>
                            }
                        </div>
                    </div>
                    <div  className="Header consolePanel panelPadding consoleSetupHeader">

                        {(logMessage && logMessage.length > 0)
                            && logMessage.map(x => <div
                                className={`${x == 'Failed' ? ' FailedText' : 'logMessages'} ${x == 'Passed' ? ' PassedText' : 'logMessages'}`}>
                                {x}</div>)}
                                <div ref={ messagesEndRef}/>
                    </div>

                </div>

            </div>
        </>
    )
}

export default HomeScreen;