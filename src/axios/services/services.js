import { instance } from "../instance";

export async function getServicios() {
  try {
    const { data } = await instance.get("/services");
    return data.filter(
      (s) => s.user?.role_id === 4 && s.user?.status === "activo"
    );
  } catch (error) {
    throw error;
  }
}

export async function getEvidence(id) {
  try {
    const response = await instance.get(`/evidence/${id}`, {
      headers: {
        "Content-Type": "application/pdf",
        "Accept": "application/pdf",
      },
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const revisarServicio = async (id, status, comment, amount_approved = 0) => {
  const payload = { status, comment };
  if (status === "1") payload.amount_approved = amount_approved;

  const response = await instance.patch(`/review/${id}`, payload);
  return response.data;
};
