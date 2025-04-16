import useAuthStore from '@/store/authStore';
import axios from 'axios';

export const BACKEND_URL = 'https://hemoglobin-nil.com'

const api = axios.create({
    baseURL: 'https://hemoglobin-nil.com/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  /**
   * Handle request interceptors
   * Adds authorization token to request headers if available
   */
  api.interceptors.request.use(
    (config: any) => {
      const { token } = useAuthStore.getState() as { token: string };
      //console.log('token', token)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;

      }
      return config;
    },
    (error: any) => Promise.reject(error)
  );
  

  /**
   * Handle response interceptors
   * Logs errors for debugging purposes
   */
  api.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      console.log('API Error:', error);
      return Promise.reject(error);
    }
  );

  // register system
  const register = async (data: any) => {
    console.log('data', data)
    try {
      const response = await api.post('/user/registration', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // get location by parent id
  const getLocationByParentId = async (parentId: any) => {
    try {
      const response = await api.get(`/location/GetByParentId/${parentId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // login system

  // /api/Auth/usertype
  const getUserType = async (data: any) => {
    console.log(data);
    try {
      const response = await api.post('/Auth/usertype', data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // /api/Auth/token

  const getToken = async (data: any) => {
    try {
      const response = await api.post('/Auth/token', data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
  
  
  const getBloodBankData = async (data: any) => {
    try {
      const response = await api.post('/bloodbank/getbloodbankdata',data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  ///api/campaign/create
  const createCampaign = async (data: any) => {
    try {
      const response = await api.post('/campaign/create', data,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  ///api/campaign/getall
  const getAllCampaign = async (pageNo: any, pageSize: any) => {
    try {
      const response = await api.get(`/campaign/getall?pageNo=${pageNo}&pageSize=${pageSize}`);
      return response.data;
    } catch (error: any) {  
      if(error?.status === 404) {
        return []
      }
      throw error;
    }
  }

  ///api/campaign/update
  const updateCampaign = async (id: any, data: any) => {
    try {
      const response = await api.put(`/campaign/update/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  ///api/campaign/delete/{id}
  const deleteCampaign = async (id: any) => {
    try {
      const response = await api.delete(`/campaign/delete/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // /api/campaign/getRunningAndUpcomingCampaign
  const getRunningAndUpcomingCampaign = async (pageNo: any, pageSize: any) => {
    try {
      const response = await api.get(`/campaign/getRunningAndUpcomingCampaign?pageNo=${pageNo}&pageSize=${pageSize}`);
      return response.data;
    } catch (error: any) {
      if(error?.status === 404) {
        return []
      }
      throw error;
    }
  }

  const getCampaignById = async (id: any) => {
    try {
      const response = await api.get(`/campaign/get/${id}`);
      return response.data;
    } catch (error: any) {
      if(error?.status === 404) {
        return []
      }
      throw error;
    }
  }

  ///api/campaign/getVolunteerPermittedCampaigns
  const getVolunteerPermittedCampaigns = async (pageNo: any, pageSize: any) => {
    try {
      const response = await api.get(`/campaign/getVolunteerPermittedCampaigns?pageNo=${pageNo}&pageSize=${pageSize}`);
      return response.data;
    } catch (error: any) {
      if(error?.status === 404) {
        return []
      }
      throw error;
    }
  }

  const getApprovedVolunteer = async (pageNo: any, pageSize: any) => {
    try {
      const response = await api.get(`/user/getApprovedVolunteer?pageNo=${pageNo}&pageSize=${pageSize}`);
      return response.data;
    } catch (error: any) {
      if(error?.status === 404) {
        return []
      }
      throw error;
    }
  }

  ///api/user/getUnapprovedVolunteer 
  const getUnapprovedVolunteer = async (pageNo: any, pageSize: any) => {
    try {
      const response = await api.get(`/user/getUnapprovedVolunteer?pageNo=${pageNo}&pageSize=${pageSize}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  ///api/user/approveVolunteer/{id}
  const approveVolunteer = async (id: any) => {
    try {
      const response = await api.post(`/user/approveVolunteer`,{id});
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  ///api/user/disapprovevolunteer
  const disapproveVolunteer = async (id: any) => {
    try {
      const response = await api.post(`/user/disapprovevolunteer`,{id});
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }


//notice

  const createNotice = async (data: any) => {
    try {
      const response = await api.post('/notice/create', data,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  const updateNotice = async (id: any, data: any) => {
    try {
      const response = await api.put(`/notice/update/${id}`, data,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  const deleteNotice = async (id: any) => {
    try {
      const response = await api.delete(`/notice/delete/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  const getAllNotice = async (pageNo: any, pageSize: any) => {
    try {
      const response = await api.get(`/notice/getall?pageNo=${pageNo}&pageSize=${pageSize}`);
      return response.data;
    } catch (error: any) {
      if(error?.status === 404) {
        return []
      }
      throw error;
    }
  }


  //media

  ///api/media/uploadcampaignmedia
  const uploadCampaignMedia = async (data: any) => {
    try {
      const response = await api.post('/media/uploadcampaignmedia', data,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  const getAllMedia = async (data: any) => {
    try {
      const response = await api.post('/media/getallmedia',data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  const getCampaignMedia = async (campaignId: any) => {
    try {
      const response = await api.get(`/media/getcampaignmedia?campaignId=${campaignId}`);  
      return response.data;
    } catch (error: any) {
      if(error?.status === 404) {
        return []
      }
      throw error;
    }
  }

  ///api/media/delete/{id}
  const deleteMedia = async (mediaId: any, campaignId: any) => {
    try {
      const response = await api.delete(`/media/deletecampaignmedia`, {
        data: { mediaId, campaignId }
      });
      return response.data;
    } catch (error: any) {  
      throw error;
    }
  }



  // contact us
  const sendContact = async (data: any) => {
    try {
      const response = await api.post('/contact/create', data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  ///api/contact/getall
  const getAllContact = async (contactType: any,pageNo: any, pageSize: any) => {
    try {
      const response = await api.get(`/contact/getall?contactType=${contactType}&pageNo=${pageNo}&pageSize=${pageSize}`);
      return response.data;
    } catch (error: any) {
      if(error?.status === 404) {
        return []
      }
      throw error;
    }
  }

  ///api/contact/read
  const readContact = async (id: any) => {
    try {
      const response = await api.post(`/contact/read`, {id});
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

//news 

///api/news/create
const createNews = async (data: any) => {
  console.log(data);
  try {
    const response = await api.post('/news/create', data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

///api/news/getall
const getAllNews = async (pageNo: any, pageSize: any) => {
  try {
    const response = await api.get(`/news/getall?pageNo=${pageNo}&pageSize=${pageSize}`);
    return response.data;
  } catch (error: any) {    
    throw error;
  }
}

///api/news/update
const updateNews = async (data: any) => {
  try {
    const response = await api.put(`/news/update`, data);
    return response.data;
  } catch (error: any) {  
    throw error;
  }
}

///api/news/delete
const deleteNews = async (id: any) => {   
  try {
    const response = await api.delete(`/news/delete/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
} 





  const getAllDonors = async (data: any) => {
    try {
      const response = await api.post('/donor/getall', data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  ///api/user/getbyid/{id}
  const getUserById = async (id: any) => {
    try {
      const response = await api.get(`/user/getbyid/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  ///api/bloodbank/getdashboarddata
  const getDashboardData = async () => {
    try {
      const response = await api.get('/bloodbank/getdashboarddata');
      return response.data;
    } catch (error: any) {  
      throw error;
    }
  }

  ///api/user/getUnapprovedDonor
  const getUnapprovedDonor = async (data: any) => {
    try {
      const response = await api.post(`/user/getUnapprovedDonor`, data);
      return response.data;
    } catch (error: any) {
      if(error?.status === 404) {
        return []
      }
      throw error;
    }
  }
  ///api/user/getApprovedDonor  
  const getApprovedDonor = async (data: any) => {
    try {
      const response = await api.post(`/user/getApprovedDonor`, data);
      return response.data;
    } catch (error: any) {
      if(error?.status === 404) {
        return []
      }
      throw error;
    }
  }
  
  
  //admin 
  ///api/user/getAllAdmin
  const getAllAdmin = async (pageNo: any, pageSize: any) => {
    try {
      const response = await api.get(`/user/getAllAdmin?pageNo=${pageNo}&pageSize=${pageSize}`);
      return response.data;
    } catch (error: any) {
      if(error?.status === 404) {
        return []
      }
      throw error;
    }
  }

  ///api/user/getOfficialLeaders
  const getOfficialLeaders = async () => {
    try {
      const response = await api.get(`/user/getOfficialLeaders`);
      return response.data;
    } catch (error: any) {  
      if(error?.status === 404) {
        return []
      }
      throw error;
    }
  }

  ///api/user/getScoutLeaders
  const getScoutLeaders = async (pageNo: any, pageSize: any) => {
    try {
      const response = await api.get(`/user/getScoutLeaders?pageNo=${pageNo}&pageSize=${pageSize}`);
      return response.data;
    } catch (error: any) {
      if(error?.status === 404) {
        return []
      }
      throw error;
    }
  }

  ///api/user/donorRegistration
  const donorRegistration = async (data: any) => {
    console.log('data', data);
    try {
      const response = await api.post(`/user/donorRegistration`, data ,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  ///api/user/getPermittedDonors
  const getPermittedDonors = async (pageNo: any, pageSize: any) => {
    try {
      const response = await api.get(`/user/getPermittedDonors?pageNo=${pageNo}&pageSize=${pageSize}`);
      return response.data;
    } catch (error: any) {
      if(error?.status === 404) {
        return []
      }
      throw error;
      
    }

  }
  ///api/user/update
  const updateUser = async (data: any) => {
    try {
      const response = await api.put(`/user/update`, data ,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }


  export default { 
    register,
    getLocationByParentId,
    getUserType,
    getToken,
    updateUser,
    getBloodBankData,
    createCampaign,
    getAllCampaign,
    updateCampaign,
    deleteCampaign,
    uploadCampaignMedia,
    deleteMedia,
    getRunningAndUpcomingCampaign,
    getCampaignById,
    getApprovedVolunteer,
    getUnapprovedVolunteer,
    approveVolunteer,
    disapproveVolunteer,
    createNotice,
    updateNotice,
    deleteNotice,
    getAllNotice,
    getAllMedia,
    getCampaignMedia,
    sendContact,
    getAllContact,
    readContact,
    getAllDonors,
    createNews,
    getAllNews,
    updateNews,
    deleteNews,
    getUserById,
    getDashboardData,
    getUnapprovedDonor,
    getApprovedDonor,
    getAllAdmin,
    getVolunteerPermittedCampaigns,
    getOfficialLeaders,
    getScoutLeaders,
    donorRegistration,
    getPermittedDonors
};