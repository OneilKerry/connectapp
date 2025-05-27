export default function UserCard({ name, email, roles, Status }) {
    return (
        <div className="user-card flex w-[97%] justify-between items-center border border-gray-300 rounded-[7px] p-3 mb-2 bg-white text-[15px] leading-tight">
            <div className="user-info">
                <h2 className="text-base font-bold text-[16px] font-sans">{name}</h2>
                <p className="my-[2px] text-gray-600 font-sans">{email}</p>
                <div className="mt-1.5"></div>
                <span className="inline-block bg-black text-white px-1 py-[1px] text-[10px] rounded-[2px] font-sans mr-1.5">{roles}</span>
            </div>
            <div className="status aktif flex text-lg font-bold font-sans">{Status}</div>
        </div>
    );
}
