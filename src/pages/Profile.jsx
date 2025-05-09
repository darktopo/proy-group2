import UpdatePassword from "../components/UpdatePassword";
import UpdateProfile from "../components/UpdateProfile";

export default function Profile() {

    return (
        <div className="w-full bg-[rgb(229,231,237)] py-8 px-4">
            <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md ">

                <UpdateProfile />

                <UpdatePassword />

            </div>
        </div>
    )
}