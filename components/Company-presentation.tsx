'use client';

import Image from 'next/image';
import { Button } from '@nextui-org/react';
import CompanyLogo from '../images/company.png'; // Replace with the actual company logo path
import {GlobeAltIcon} from '@heroicons/react/solid';

const CompanyPresentation = () => {
    return (
        <div className="max-w-md w-full mx-auto rounded-lg shadow-lg p-6">
            <div className="flex flex-col items-center justify-center">
                <div className="mb-4">
                    <Image
                        src={CompanyLogo}
                        alt="Company Logo"
                        className="w-24 h-24 rounded-full border border-gray-400 shadow-lg"
                    />
                </div>
                <h2 className="text-gray-800 mt-4 font-semibold text-2xl"> ApiTree s.r.o.</h2>
                <p className="text-gray-600 mt-2 text-center mb-6">
                    V ApiTree s.r.o. se primárně soustředíme na zakázkový vývoj aplikací a konzultační činnost.
                </p>
                <div className="flex flex-col items-center space-y-4 w-full">
                    <Button
                        auto
                        className="w-[70%] bg-blue-400 hover:bg-blue-500 text-white rounded-lg shadow-md"
                    >
                        <GlobeAltIcon className="w-5 h-5" />
                        www
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CompanyPresentation;