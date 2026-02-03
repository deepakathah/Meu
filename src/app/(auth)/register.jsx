import globalFonts from "@/theme/fontFamily";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppState,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import CheckBox from '@/components/atoms/CheckBox';
import DobPicker from '@/components/molecules/DobPicker';
import FileUpload from '@/components/molecules/FileUpload';
import GenderPicker from '@/components/molecules/GenderPicker';
import Loading from '@/components/molecules/Loading';
import MessageBubble from '@/components/molecules/MessageBubble';
import ModelMessage from '@/components/molecules/ModelMessage';
import ModelVideo from '@/components/molecules/ModelVideo';
import SelectIdenty from '@/components/molecules/SelectIdenty';
import SelectProfession from '@/components/molecules/SelectProfession';
import UploadSelfie from '@/components/molecules/UploadSelfie';

import ThreeDotAnimation from '@/components/molecules/ThreeDotAnimation';
import UploadPictures from "@/components/molecules/UploadPictures";
import { phoneLengthByCountry } from "@/constant/phoneLengthByCountry";
import chatBotStyle from '@/theme/chatBotStyle';
import globalStyle from '@/theme/globalStyle';
import themeColors from '@/theme/themeColors';
import CountrySelect from "react-native-country-select";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const { width, height } = Dimensions.get('window');

const ChatBotRegister = () => {
  const router = useRouter();
  const { action, user_id } = useSelector(state => state.auth);
  const { wsUrl } = Constants.expoConfig.extra;

  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState(null);
  const [messageKey, setMessageKey] = useState(null);
  const [keyboardType, setKeyboardType] = useState('default');
  const [userId, setUserId] = useState(null);
  const [isError, setIsError] = useState(false);
  const [returnData, setReturnData] = useState({});
  const [s3UploadData, setS3UploadData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isVideo, setIsVideo] = useState('');
  const [isResponse, setIsResponse] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [countryCode, setCountryCode] = useState("IN");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [callingCode, setCallingCode] = useState("+91");
  const [modals, setModals] = useState({
    dob: false,
    gender: false,
    profession: false,
    identity: false,
    identityImage: false,
    selfieImage: false,
    selfiePicturs: false,
  });

  const scrollViewRef = useRef();
  const wsRef = useRef();
  const appStateRef = useRef(AppState.currentState);
  const hasConnectedOnce = useRef(false);
  let pingInterval;

  useEffect(() => {
    setSelectedCountry({
      cca2: "IN",
      idd: {
        root: "+91",
      },
      flag: "🇮🇳",
    });
  }, []);


  const handleCountrySelect = (country) => {
    setCountryCode(country?.cca2 ?? "IN");
    setSelectedCountry(country);
    setShowPicker(false);
    setInputText("");
    setCallingCode(country?.idd?.root)
  };


  const handleMobileValidation = useCallback((val) => {
    const expected = phoneLengthByCountry[countryCode] || phoneLengthByCountry.DEFAULT;
    const value = val.replace(/\D/g, '');

    if (value.length <= expected.length) setInputText(value);
    if (value.length === expected.length) Keyboard.dismiss();
  }, [countryCode]);


  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        if (!hasConnectedOnce.current) {
          ws.send(JSON.stringify({ action: action || 'start', user_id }));
          hasConnectedOnce.current = true;
        }

        setIsLoading(false);
        console.log('✅ WebSocket connected');

        // Start sending ping every 30 seconds
        pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ action: 'ping' }));
          }
        }, 30000);
      };

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('get:', JSON.stringify(data));
        if (data.url) {
          setS3UploadData(data);
        } else if (data.header) {
          const newMessage = {
            sender: 'bot',
            header: data.header,
            content: data.content,
            image: null,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            color: themeColors[data.color] || themeColors.primaryRichPurple,
          };

          if (data.action !== "confirmUserImagesUpload") {
            setMessages(prev => [...prev, newMessage]);
          }

          // const { header, content, ...rest } = data;
          // setReturnData(rest);
          // const { header, content } = data;
          setReturnData(data);
          if (data.key) setMessageKey(data.key[0]);
          if (data.user_id) {
            setUserId(data.user_id);
            await AsyncStorage.setItem('userId', data.user_id);
          }
          setKeyboardType(data.keyboard);
          setIsResponse(false)
        }
      };
      ws.onerror = e => console.error('WebSocket error:', e);
      ws.onclose = e => {
        console.log('WebSocket closed:', e.code);
        clearInterval(pingInterval);
      };

      wsRef.current = ws;
      setSocket(ws);
    };

    connectWebSocket();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App resumed, reconnecting WebSocket...');
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          wsRef.current?.close();
          connectWebSocket();
        }
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      wsRef.current?.close();
      clearInterval(pingInterval);
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(t);
  }, [messages]);


  const sendMessage = useCallback(async (input, answerObj = null, imagePayload = null) => {
    if (!input && selectedOptions.length === 0) return;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const storedUserId = userId || await AsyncStorage.getItem('userId');

    let isImage = false;
    let imageData = null;
    let textData = null;

    if (Array.isArray(input)) {
      isImage = input.every(item =>
        /\.(jpeg|jpg|png|gif|webp|bmp|svg|pdf)$/i.test(item)
      );
      imageData = input;
    }
    else if (typeof input === 'string' && /\.(jpeg|jpg|png|gif|webp|bmp|svg|pdf)$/i.test(input)) {
      isImage = true;
      imageData = input;
    }
    else {
      textData = input;
    }

    // personality bot case
    if (!answerObj && returnData.action === 'personalitybot') {
      answerObj = { answerText: textData, answerOption: selectedOptions };
    }

    // append selected options
    if (selectedOptions.length > 0 || textData) {
      // textData = `${textData}, ${selectedOptions.join(', ')}`;
      textData = 
          textData && selectedOptions.length > 0 ? `${textData}, ${selectedOptions.join(', ')}` 
          : textData ? `${textData}` : selectedOptions.join(', ');
    }

    const messagePayload = {
      [messageKey]: answerObj ?? (isImage ? true : textData),
      user_id: storedUserId,
      countryCode: callingCode,
      ...returnData,
    };
    // ✅ SHOW MESSAGE IN UI
    setMessages(prev => [
      ...prev,
      {
        sender: 'user',
        header: '',
        content: isImage ? null : textData,
        image: isImage ? imageData : null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    // ✅ SEND TO SOCKET
    socket.send(JSON.stringify(isImage ? imagePayload : messagePayload));

    console.log('Sent:', JSON.stringify(isImage ? imagePayload : messagePayload));

    setInputText('');
    setSelectedOptions([]);
    setReturnData({});
    setIsResponse(true);
  }, [
    socket,
    messageKey,
    userId,
    returnData,
    selectedOptions,
    callingCode
  ]);



  useEffect(() => {
    let completedTimer, timer
    if (returnData?.action === 'second' ||
      returnData?.action === 'startQuestion' ||
      returnData?.status === 'endMessage' ||
      returnData?.status === 'startPersonalityBot' ||
      returnData?.messageKey === '2') {
      timer = setTimeout(() => {
        socket?.send(JSON.stringify(returnData));
      }, 1000);
    }
    else if (returnData?.action === 'completed') {
      setIsResponse(true)
      completedTimer = setTimeout(() => {
        router.replace("/(auth)");
      }, 10000);
    }

    return () => {
      clearTimeout(timer)
      clearTimeout(completedTimer);
    };
  }, [returnData, socket]);


  const renderActionButton = (label, onPress, btnWidth) => (
    <Animatable.View animation="slideInUp" delay={500} style={globalStyle.flexCenter}>
      <TouchableOpacity
        style={[globalStyle.commonBtn, globalStyle.MarginTop15, { backgroundColor: themeColors[returnData.color || 'primaryRichPurple'], width: btnWidth }]}
        onPress={onPress}>
        <Text style={[globalStyle.btnTextCommon, globalFonts.poppins_600, { color: themeColors.white }]}>{label}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  const renderBottomInput = () => {
    const { status, inputPlaceholder } = returnData;
    // const { status, inputPlaceholder } = { "action": "userImagesUpload", "header": "Please upload more images of you.", "content": "Upload 3-5 images of you to enhance your profile.", "key": ["images"], "color": "secondaryVibrantPink", "user_id": "6954bc82f579ccfd57baa3e5", "status": "userImagesUpload" };
    // const { status } = { "action": "answer", "header": "💼 What’s your profession?", "content": "This helps us suggest the best matches for you.", "color": "secondaryVibrantPink", "question_id": "683952a93b049e6881536ef1", "options": ["Information Technology", "Finance & Bank", "Healthcare", "Media & Entertainment", "Telecommunications", "Agriculture & Farming", "Aerospace & Defense", "Fashion & Apparel", "Other"], "key": ["answer"], "status": "profession", "user_id": "695364284ff2da730a812fce", "videoPath": "", "basePath": "https://s3.ap-south-1.amazonaws.com/dev.theredhotice.com/MeuDatingApp/" };

    switch (status) {
      case 'dob':
        return renderActionButton('Choose DOB', () => setModals(prev => ({ ...prev, dob: true })), width * 0.9);

      case 'gender':
        return renderActionButton('Choose Gender', () => setModals(prev => ({ ...prev, gender: true })), width * 0.9);

      case 'profession':
        return renderActionButton('Select Profession', () => setModals(prev => ({ ...prev, profession: true })), width * 0.9);

      case 'identity_proof':
        return renderActionButton('Select Identity Proofs', () => setModals(prev => ({ ...prev, identity: true })), width * 0.9);

      case 'uploadFrontImage':
      case 'uploadBackImage':
      case 'EmpidCardImage':
        return renderActionButton('Select Image', () => setModals(prev => ({ ...prev, identityImage: true })), width * 0.9);

      case 'selfie':
        return renderActionButton('Click Selfie', () => setModals(prev => ({ ...prev, selfieImage: true })), width * 0.9);

      case 'userImagesUpload':
        return renderActionButton('Upload More Pictures', () => setModals(prev => ({ ...prev, selfiePicturs: true })), width * 0.9);

      case 'register':
        return (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
            {!isResponse &&
              (<Animatable.View style={chatBotStyle.sendMessageInput} animation="slideInUp" delay={500}>
                <View style={globalStyle.btnContainer}>
                  <View style={styles.phoneContainer}>
                    <TouchableOpacity onPress={() => setShowPicker(true)}>
                      {selectedCountry ? (
                        <Text style={{ fontSize: verticalScale(14) }}>
                          {selectedCountry.flag}  {selectedCountry?.idd?.root}
                        </Text>
                      ) : (
                        <Text>Select</Text>
                      )}
                    </TouchableOpacity>

                    <CountrySelect
                      visible={showPicker}
                      onClose={() => setShowPicker(false)}
                      onSelect={handleCountrySelect}
                    />

                    <TextInput
                      placeholder="9999999999"
                      keyboardType="phone-pad"
                      value={inputText}
                      onChangeText={handleMobileValidation}
                      style={[globalStyle.inputField, { marginLeft: scale(5) }]}
                      placeholderTextColor="#616161"
                    />
                  </View>

                  <TouchableOpacity style={chatBotStyle.sendButton} onPress={() => sendMessage(inputText)}>
                    <Image source={require('@/assets/images/send-message.png')} resizeMode="contain" />
                  </TouchableOpacity>
                </View>
              </Animatable.View>)
            }

          </KeyboardAvoidingView>
        );

      default:
        return (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
            {!isResponse &&
              (<Animatable.View style={chatBotStyle.sendMessageInput} animation="slideInUp" delay={500}>
                <View style={globalStyle.btnContainer}>
                  <TextInput
                    placeholder={inputPlaceholder ?? "Type your message"}
                    keyboardType={keyboardType}
                    style={[chatBotStyle.inputField, globalStyle.normalFontSize, globalFonts.poppins_500]}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholderTextColor="#616161"
                    returnKeyType="send"
                    onSubmitEditing={() => sendMessage(inputText)}
                  />

                  <TouchableOpacity style={chatBotStyle.sendButton} onPress={() => sendMessage(inputText)}>
                    <Image source={require('@/assets/images/send-message.png')} resizeMode="contain" />
                  </TouchableOpacity>
                </View>
              </Animatable.View>)
            }

          </KeyboardAvoidingView>
        );
    }
  };


  if (isError) return <ModelMessage message={isError} setIsError={setIsError} />;
  if (isLoading) return <Loading />;

  return (
    <SafeAreaView style={[chatBotStyle.container, { backgroundColor: themeColors.darkCharcoal }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <StatusBar barStyle="dark-light" />
          <ScrollView
            ref={scrollViewRef}
            style={chatBotStyle.chatMessageBox}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20, justifyContent: 'flex-end' }}
          >
            {messages.map((msg, idx) => <MessageBubble key={idx} msg={msg} />)}
            {returnData.action === 'personalitybot' && (
              <Animatable.View animation="fadeIn" duration={2000} key={returnData.options_A}>
                <CheckBox
                  options={returnData.options_A}
                  color={returnData.color}
                  selectedOptions={selectedOptions}
                  setSelectedOptions={setSelectedOptions}
                />
              </Animatable.View>
            )}
            {isResponse && <ThreeDotAnimation />}

          </ScrollView>

          {returnData.videoPath ? (
            <Animatable.View animation="slideInUp" delay={500} >
              <View style={[globalStyle.flexCenter, { columnGap: 10 }]}>
                {renderActionButton('Watch Video', () => setIsVideo(`${returnData.basePath}${returnData.videoPath}`), width * 0.4)}
                {renderActionButton('Continue', () => socket.send(JSON.stringify(returnData)), width * 0.4)}
              </View>
            </Animatable.View>
          ) :
            Array.isArray(returnData.chooseOptions) && returnData.chooseOptions.length > 0 ? (
              <Animatable.View animation="slideInUp" delay={500} >
                <View style={[globalStyle.flexCenter, { columnGap: 10 }]}>
                  {renderActionButton(returnData.chooseOptions[0], () => sendMessage(returnData.chooseOptions[0]), width * 0.4)}
                  {renderActionButton(returnData.chooseOptions[1], () => sendMessage(returnData.chooseOptions[1]), width * 0.4)}
                </View>
              </Animatable.View>
            ) : (
              renderBottomInput()
            )}

          {modals.dob && <DobPicker setIsOpenDobPicker={flag => setModals(prev => ({ ...prev, dob: flag }))} sendMessage={sendMessage} />}

          {modals.gender && <GenderPicker setIsOpenGender={flag => setModals(prev => ({ ...prev, gender: flag }))} sendMessage={sendMessage} options={returnData.options} color={returnData.color} />}

          {modals.profession && <SelectProfession setIsOpenProfession={flag => setModals(prev => ({ ...prev, profession: flag }))} sendMessage={sendMessage} options={returnData.options} color={returnData.color} />}

          {modals.identity && <SelectIdenty setIsOpenIdentity={flag => setModals(prev => ({ ...prev, identity: flag }))} sendMessage={sendMessage} options={returnData.options} color={returnData.color} />}

          {modals.identityImage && <FileUpload setIsIdentityImage={flag => setModals(prev => ({ ...prev, identityImage: flag }))} sendMessage={sendMessage} returnData={returnData} socket={socket} s3UploadData={s3UploadData} />}

          {modals.selfieImage && <UploadSelfie setModals={setModals} setIsSelfieImage={flag => setModals(prev => ({ ...prev, selfieImage: flag }))} sendMessage={sendMessage} returnData={returnData} socket={socket} s3UploadData={s3UploadData}
            color={returnData.color} />}

          {modals.selfiePicturs && <UploadPictures setModals={setModals} setIsselfiePicturs={flag => setModals(prev => ({ ...prev, selfiePicturs: flag }))} sendMessage={sendMessage} returnData={returnData} socket={socket} color={returnData.color} />}

          {isVideo && <ModelVideo videoPath={isVideo} setIsVideo={setIsVideo} color={returnData.color} returnData={returnData} socket={socket} />}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ChatBotRegister;

const styles = StyleSheet.create({
  phoneContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeColors.white,
    borderRadius: moderateScale(height * 0.05 / 2),
    paddingLeft: moderateScale(10),
    height: height * 0.05,
  },

  countryPicker: {
    flexDirection: "row",
    alignItems: "center",
  },

})
