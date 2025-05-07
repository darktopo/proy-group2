import { useNavigate } from "react-router"
import { logout } from "../axios/auth/auth"


export default function Navbar({setMenu}) {
  const navigate = useNavigate() //import from react router
    async function handleLogout() {
        try {
            const status = await logout()           
            if (status === 200) {
                navigate("/login")
            }
        } catch (error) {
            console.log(error)
        }

    }

  function openMenu() {
    setMenu(true)
  }

return (
  <div>
    <nav className='bg-[#153862] w-full h-20 flex justify-between items-center px-5 md:px-12'>
      <img className='w-35' src="logo_funval_2.jpg" alt="" />
      <div className='flex items-center gap-2'>
        <button className='bg-[#08294b] hover:bg-[#051d35] rounded shadow-black shadow-sm cursor-pointer lg:hidden'onClick={openMenu} ><img src="barra-de-menus (1).png" alt="" /></button>
        <button className='bg-[#08294b] hover:bg-[#051d35] h-10 w-18 shadow-black shadow-sm text-white rounded-lg font-medium tracking-tight cursor-pointer hidden lg:block'onClick={openMenu}>Menu</button>
        <button className='bg-[#08294b] hover:bg-[#051d35] h-8.5 lg:h-10 w-18 shadow-black shadow-sm text-white rounded-lg font-medium tracking-tight cursor-pointer'onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  </div>
)
}
