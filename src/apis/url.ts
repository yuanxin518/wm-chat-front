const baseUrl = "http://localhost:4000"

export default {
	LOGIN: `${baseUrl}/auth/login`,
	UPDATE: `${baseUrl}/auth/update`,
	PROFILE: `${baseUrl}/user/info`,
	FRIEND: `${baseUrl}/user/friend`,
	MSG_DETAIL: `${baseUrl}/message/detail`,
	ME_INFO: `${baseUrl}/user/meInfo`,
	DELETE_USER:`${baseUrl}/user/deleteUser`,
	WORD:`${baseUrl}/message/allMsg`
}
