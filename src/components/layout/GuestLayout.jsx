import { Outlet } from "react-router-dom";

const GuestLayout = () => {
  return (
    <div className="h-full relative flex justify-center sm:py-2 bg-[#ffffff] md:justify-between">
      {/* Left Column (Hidden on Mobile) */}
      <div className="relative hidden md:block w-[35%] h-screen ">
        <img
          className="absolute bottom-0 w-[606px] h-[407px]"
          src="/images/base_left_img.svg"
          alt=""
        />
      </div>

      {/* Middle Column */}
      <div className="mx-2 lg:mx-0 md:w-[30%] min-w-[300px] w-[80%]  h-full flex justify-center items-center bg-[#ffffff]">
        <Outlet />
      </div>

      {/* Right Column (Hidden on Mobile) */}
      <div className=" relative hidden md:block w-[35%] h-screen">
        <img
          className="absolute bottom-0 w-[606px] h-[407px]"
          src="/images/base_right_img.svg"
          alt=""
        />
      </div>
    </div>
  );
};

export default GuestLayout;
