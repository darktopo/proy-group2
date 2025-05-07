import { instance } from "../instance";

export async function login(request) {
    try {
        const { data } = await instance.post('/auth/login', request)
        return data
    } catch (error) {
        throw error
    }
}

export async function logout() {
    try {
        const { status } = await instance.post('/auth/logout')
        return status
    } catch (error) {
        throw error
    }
}

export async function profile() {
    try {
        const { data } = await instance.get(`/auth/profile`)
        return data
    } catch (error) {
        throw error
    }
}