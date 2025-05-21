export default function roles() {
    return (

      <section
        id="navigation"
        className="bg-white w-[15%] border-r border-gray-300 p-4 "
      >
        <h1 className="text-[30px] mb-5  font-sans  font-bold text-center">
          Connect
        </h1>
        <div className="nav-buttons flex flex-col items-center gap-4 p-2 w-full mb-2 font-bold text-[18px]">
          <button className="rounded-[10px] flex items-center gap-2 py-2 px-3 bg-black text-white border border-gray-300 w-[90%] cursor-pointer">
            <IconUser /> User
          </button>
          <button className=" flex items-center gap-2 py-2 px-3 w-[90%]">
            <IconUsersPlus /> Hak Akses
          </button>
          <button className=" flex items-center gap-2 py-2 px-3  w-[90%] ">
            <IconLogout2 /> Logout
          </button>
        </div>
      </section>

    );
}