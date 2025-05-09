import { instance } from "../instance"

export async function update(request, id) {
    try {
        const { status } = await instance.put(`/users/${id}`, request)
        return status
    } catch (error) {
        throw error
    }

}

