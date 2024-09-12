'use client';

import Image from 'next/image';
import { Button } from '@nextui-org/react';
import Logo from '../images/pardy.png'; // Update with your actual logo path
import { useEffect, useRef } from 'react';

const CompanyIntroduction = () => {
    const parallaxRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (parallaxRef.current) {
                parallaxRef.current.style.transform = `translateY(${scrollTop * 0.3}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative w-full h-full p-4 bg-gray-50 rounded-lg shadow-lg overflow-hidden">
            <div
                ref={parallaxRef}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg"
                style={{
                    transition: 'transform 0.2s ease-out',
                }}
            >
                <div className="mb-4">
                    <Image
                        src={Logo}
                        alt="Company Logo"
                        className="w-24 h-24 rounded-full shadow-md"
                    />
                </div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">Pardy Inc.</h1>
                <p className="text-gray-600 text-center mb-6">
                    Welcome to Pardy Inc. We're excited to assist you with our innovative event management solutions. Let us know how we can help you!
                </p>
                <div className="flex flex-col items-center space-y-4 w-full">
                    <Button
                        auto
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-md"
                    >
                        Visit Website
                    </Button>
                    <Button
                        auto
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md"
                    >
                        Contact Us
                    </Button>
                    <Button
                        auto
                        className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md"
                    >
                        Learn More
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CompanyIntroduction;