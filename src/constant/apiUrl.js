import Constants from 'expo-constants';

const getApiUrl = () => {
    const apiURL = Constants?.expoConfig?.extra?.apiURL;
    if (!apiURL) throw new Error('API URL is not defined in expo-constants');
    return apiURL;
};

export default getApiUrl