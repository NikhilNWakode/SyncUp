export const HOST = import.meta.env.VITE_SERVER_URL || "http://localhost:8747";
 // Ensure VITE_SERVER_URL is correctly set in your .env file

export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTE = `${HOST}${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${HOST}${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${HOST}${AUTH_ROUTES}/user-info`;
export const UPDATE_PROFILE_ROUTE =`${HOST}${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${HOST}${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${HOST}${AUTH_ROUTES}//remove-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const CONTACT_ROUTES = "api/contacts";
export const SEARCH_CONTACT_ROUTES =`${CONTACT_ROUTES}/search`;
export const GET_DM_CONTACTS_ROUTES =`${CONTACT_ROUTES}/get-contact-for-dm`;
export const GET_ALL_CONTACTS_ROUTES =`${CONTACT_ROUTES}//get-all-contact`;


export const  Message_Routes = "api/messages";
export const  GET_ALL_MESSAGES_ROUTE = `${Message_Routes}/get-messages`;
export const UPLOAD_FILE_ROUTE = `${Message_Routes}/upload-file`;


export const CHANNEL_ROUTES = 'api/channel';
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/create-channel`;
export const GET_USER_CHANNELS_ROUTE = `${CHANNEL_ROUTES}/get-user-channels`;