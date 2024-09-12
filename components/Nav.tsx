'use client';

const Nav = () => {
    return (
        <nav className="h-[120px] flex items-center justify-start px-10 bg-white">
            <div className="flex items-center">
                {/* Logo */}
                <h1 className="text-2xl font-bold text-indigo-600 mr-4">
                    Hire<span className="text-green-500">Me</span>
                </h1>

                {/* Additional Text */}
                <p className="text-lg text-gray-600">
                    Your first line interview partner!
                </p>
            </div>
        </nav>
    );
};

export default Nav;