'use client';

import Image from 'next/image';
import Agent1 from '../images/girl1.png';
import Agent2 from '../images/man1.png';

const AvatarSection = ({ avatarSrc, userName, description }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-4 max-w-xs"> {/* max-w-xs to constrain width */}
            <Image
                src={avatarSrc}
                alt={userName}
                className="w-20 h-20 rounded-full border border-gray-400 shadow-lg"
            />
            <p className="text-gray-800 mt-4 font-semibold">{userName}</p>
            <p className="text-gray-600 mt-2 text-center text-sm leading-relaxed"> {/* Ensure text wraps nicely */}
                {description}
            </p>
        </div>
    );
};

const AvatarPresentation = () => {
    return (
        <div className="flex flex-col h-full rounded-lg shadow-lg p-4">
            <AvatarSection
                avatarSrc={Agent1} // Replace with your first avatar path
                userName="Simona"
                description="Ředitelka společnosti. Odpoví na otázky ohledně společnosti Apitree."
            />
            <div className="border-t border-gray-300 my-4"></div> {/* Divider */}
            <AvatarSection
                avatarSrc={Agent2} // Replace with your second avatar path
                userName="Aleš"
                description="CTO společnosti, který má na starosti technické otázky."
            />
        </div>
    );
};

export default AvatarPresentation;